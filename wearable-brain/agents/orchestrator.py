"""LangGraph wiring."""
# agents/orchestrator.py
import asyncio, httpx, time
from .profiler import run_profiler
from .action import run_action_agent
from .arbiter import run_arbiter
from collections import deque

telemetry_window = deque(maxlen=30)
decision_log = []

async def agent_loop():
    """Main loop — runs every 10 seconds"""
    async with httpx.AsyncClient() as client:
        while True:
            try:
                # Fetch latest telemetry from stream server
                resp = await client.get("http://localhost:8765/latest")
                new_readings = resp.json()
                
                for r in new_readings:
                    telemetry_window.append(r)
                
                if len(telemetry_window) < 3:
                    await asyncio.sleep(10)
                    continue
                
                latest = telemetry_window[-1]
                window = list(telemetry_window)
                
                # Run agent pipeline
                profile = run_profiler(window)
                proposed = run_action_agent(profile, latest)
                final = run_arbiter(proposed, profile, latest)
                
                # Log decision
                decision = {
                    "timestamp": time.time(),
                    "telemetry_snapshot": latest,
                    "profile": profile,
                    "action_proposed": proposed,
                    "arbiter_final": final,
                    "overrode": final.get("overrode_action_agent", False)
                }
                decision_log.append(decision)
                
                # Keep only last 50 decisions
                if len(decision_log) > 50:
                    decision_log.pop(0)
                    
                print(f"[{time.strftime('%H:%M:%S')}] "
                      f"Profile: {profile.get('context_summary', '?')} | "
                      f"Action: {final.get('final_action', '?')}")
                
            except Exception as e:
                print(f"Agent loop error: {e}")
            
            await asyncio.sleep(10)

def get_latest_decisions(n=10):
    return decision_log[-n:]
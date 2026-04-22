"""Agents orchestrator - mock implementation for testing."""
import asyncio
from datetime import datetime
from collections import deque

# Shared telemetry buffer (last 100 readings)
telemetry_window = deque(maxlen=100)

# Shared decisions buffer
decisions_buffer = deque(maxlen=50)

async def agent_loop():
    """Mock agent loop that generates telemetry and decisions."""
    while True:
        try:
            # Generate mock telemetry every 5 seconds
            await asyncio.sleep(5)
            
            import random
            telemetry = {
                "timestamp": datetime.now().isoformat(),
                "heart_rate": 60 + random.randint(-10, 30),
                "battery": max(5, 100 - random.randint(0, 95)),
                "steps": random.randint(0, 50),
            }
            telemetry_window.append(telemetry)
            
            # Occasionally generate a decision
            if random.random() < 0.3:
                decision = {
                    "id": f"dec_{datetime.now().timestamp()}",
                    "timestamp": datetime.now().isoformat(),
                    "action": random.choice(["rest", "move", "hydrate", "meditate"]),
                    "reason": "AI-generated recommendation",
                    "confidence": round(random.uniform(0.7, 0.99), 2),
                }
                decisions_buffer.append(decision)
        except Exception as e:
            print(f"Error in agent_loop: {e}")
            await asyncio.sleep(1)

def get_latest_decisions(count: int = 20):
    """Get latest decisions from buffer."""
    return list(decisions_buffer)[-count:]

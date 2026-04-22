"""Profiler Agent."""
# agents/profiler.py
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import json

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

PROFILER_SYSTEM = """
You are a wearable device Profiler Agent. Given a rolling window of telemetry,
output a structured JSON context object with these exact fields:
{
  "activity": "one of: sleeping | resting | walking | commuting | exercising | navigating",
  "stress_level": "low | medium | high | critical",
  "location_familiarity": "home | familiar | unfamiliar",
  "vulnerability_score": 0-10,
  "context_summary": "one sentence describing the user's current state",
  "flags": ["list of notable signals like: HR_SPIKE, STILL_BODY, LOW_BATTERY, ACTIVE_NAVIGATION"]
}
Only output valid JSON. No explanation.
"""

def run_profiler(telemetry_window: list[dict]) -> dict:
    window_str = json.dumps(telemetry_window[-10:], indent=2)
    
    response = llm.invoke([
        SystemMessage(content=PROFILER_SYSTEM),
        HumanMessage(content=f"Telemetry window:\n{window_str}")
    ])
    
    try:
        return json.loads(response.content)
    except:
        return {"error": "parse_failed", "raw": response.content}
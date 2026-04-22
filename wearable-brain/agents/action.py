"""Action Agent."""
# agents/action.py
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import json

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

ACTION_SYSTEM = """
You are a wearable device Action Agent. Given a user context profile and the 
latest telemetry, decide if any action should be triggered.

Possible actions:
- SILENT: Do nothing. User should not be interrupted.
- NOTIFY_LOW: Low-priority notification (can be dismissed easily).
- NOTIFY_HIGH: High-priority alert (vibrate + sound).
- EMERGENCY_PROTOCOL: Trigger SOS — alert emergency contacts, share GPS location.
- DEFER_RECHECK: Hold the action, recheck in N seconds.

Output JSON:
{
  "action": "<one of the above>",
  "trigger": "<what caused this — e.g., HR_SPIKE, BATTERY_CRITICAL>",
  "urgency": 1-10,
  "message": "<what the notification would say to the user>",
  "defer_seconds": <null or number>,
  "reasoning": "<explain your decision in 1-2 sentences>"
}
Only output valid JSON.
"""

def run_action_agent(profile: dict, latest_telemetry: dict) -> dict:
    context = json.dumps({
        "current_profile": profile,
        "latest_reading": latest_telemetry
    }, indent=2)
    
    response = llm.invoke([
        SystemMessage(content=ACTION_SYSTEM),
        HumanMessage(content=context)
    ])
    
    try:
        return json.loads(response.content)
    except:
        return {"error": "parse_failed", "raw": response.content}
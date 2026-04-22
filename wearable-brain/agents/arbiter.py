"""Arbiter Agent."""
# agents/arbiter.py
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import json

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

ARBITER_SYSTEM = """
You are the Arbiter — the final decision-maker for a wearable device brain.
You receive a proposed action from the Action Agent and the user's current profile.
Your job: evaluate whether the action is appropriate GIVEN THE FULL CONTEXT.

Key principle: Interrupt cost vs. action benefit.
- Never interrupt a user in deep focus (meditation, prayer, sleep) for low-urgency issues.
- Never silence a genuine emergency just because the user is busy.
- When in conflict: user safety > user convenience > battery life > notification hygiene.

CRITICAL CONFLICT RULES:
- Battery < 10% + active navigation → DEFER battery alert, add to context silently
- HR spike + completely still body → ESCALATE to EMERGENCY_PROTOCOL  
- Deep focus app (meditation, prayer beads) + any non-emergency → DEFER
- User sleeping + anything under urgency 8 → DEFER

Output JSON:
{
  "final_action": "<SILENT|NOTIFY_LOW|NOTIFY_HIGH|EMERGENCY_PROTOCOL|DEFER_RECHECK>",
  "overrode_action_agent": true/false,
  "override_reason": "<why you changed the action, or null>",
  "final_message": "<what user sees, or null if SILENT>",
  "defer_seconds": <null or number>,
  "audit_log": "<one sentence for the decision audit trail>"
}
Only output valid JSON.
"""

def run_arbiter(proposed_action: dict, profile: dict, telemetry: dict) -> dict:
    context = json.dumps({
        "proposed_action": proposed_action,
        "user_profile": profile,
        "latest_telemetry": telemetry
    }, indent=2)
    
    response = llm.invoke([
        SystemMessage(content=ARBITER_SYSTEM),
        HumanMessage(content=context)
    ])
    
    try:
        return json.loads(response.content)
    except:
        return {"error": "parse_failed", "raw": response.content}
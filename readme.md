# 🧠 Arbiter Dashboard - Wearable Brain

Real-time telemetry and AI decision monitoring dashboard for the Wearable Brain project.

An intelligent wearable system that uses three AI agents to analyze sensor data and make context-aware decisions about user notifications in real-time.

---

## Quick Start

### Backend (FastAPI + AI Agents)
```bash
cd wearable-brain/server
source /path/to/.venv/bin/activate
uvicorn main:app --reload
```
Runs on: **http://localhost:8000**

### Frontend (Next.js Dashboard)
```bash
cd wearable-brain/frontend
npm install  # first time only
npm run dev
```
Runs on: **http://localhost:3000**

---

## 🤖 AI Agents - In Depth

### 1️⃣ **PROFILER Agent** - Context Understanding

**Purpose**: Analyzes sensor data to understand *what the user is currently doing*.

**Input**: Rolling window of telemetry (last 10 readings)
```json
[
  { "timestamp": "2026-04-25T14:32:15Z", "heart_rate": 78, "battery": 45, "steps": 1250 },
  { "timestamp": "2026-04-25T14:32:25Z", "heart_rate": 82, "battery": 45, "steps": 1255 },
  ...
]
```

**Output**: Structured context profile
```json
{
  "activity": "walking",  // sleeping | resting | walking | commuting | exercising | navigating
  "stress_level": "low",  // low | medium | high | critical
  "location_familiarity": "familiar",  // home | familiar | unfamiliar
  "vulnerability_score": 3,  // 0-10 scale
  "context_summary": "User walking at comfortable pace, low stress, familiar area",
  "flags": ["NORMAL_HR", "STEADY_PACE", "GOOD_BATTERY"]
}
```

**Agent Logic**:
- Examines heart rate trends (elevated? stable?)
- Checks movement patterns (still? walking? running?)
- Assesses location risk (home is safer than unfamiliar area)
- Identifies critical flags (HR spike, battery critical, unusual stillness)

**Integration**: 
- Hook into: `from agents.profiler import run_profiler`
- Pass: list of telemetry dicts
- Get: context dict to feed next agent

---

### 2️⃣ **ACTION Agent** - Decision Proposal

**Purpose**: Proposes *what action should be taken* based on the profile.

**Input**: Context profile + latest telemetry
```json
{
  "current_profile": { /* from Profiler */ },
  "latest_reading": { "heart_rate": 156, "battery": 8, "location": "unfamiliar" }
}
```

**Output**: Action proposal
```json
{
  "action": "EMERGENCY_PROTOCOL",  // SILENT | NOTIFY_LOW | NOTIFY_HIGH | EMERGENCY_PROTOCOL | DEFER_RECHECK
  "trigger": "HR_SPIKE_IN_UNFAMILIAR_LOCATION",
  "urgency": 9,  // 1-10 scale
  "message": "High heart rate detected in unfamiliar location. Checking if you're OK.",
  "defer_seconds": null,
  "reasoning": "User's HR jumped to 156 in an unfamiliar area. This warrants immediate attention."
}
```

**Agent Logic**:
- Evaluates triggers: HR anomalies, battery critical, location risk, unusual patterns
- Rates urgency: combines multiple factors into 1-10 urgency score
- Selects action from predefined set
- Generates user-facing message (if notification sent)

**Decision Actions**:
- **SILENT** → No notification. System is fine with current state.
- **NOTIFY_LOW** → Gentle notification (no vibration/sound). User can dismiss easily.
- **NOTIFY_HIGH** → Loud alert with vibration. Demands attention.
- **EMERGENCY_PROTOCOL** → SOS triggered. Emergency contacts notified. GPS shared.
- **DEFER_RECHECK** → Hold action, re-evaluate in N seconds.

**Integration**:
- Hook into: `from agents.action import run_action_agent`
- Pass: profile dict, latest telemetry dict
- Get: action proposal dict

---

### 3️⃣ **ARBITER Agent** - Final Decision Authority

**Purpose**: Overrides or validates the Action Agent's decision with *real-world wisdom*.

**Input**: Action proposal + full context
```json
{
  "proposed_action": { /* from Action Agent */ },
  "user_profile": { /* from Profiler */ },
  "latest_telemetry": { /* sensor readings */ }
}
```

**Output**: Final decision
```json
{
  "final_action": "DEFER_RECHECK",  // Arbiter may override
  "overrode_action_agent": true,
  "override_reason": "User is sleeping. Do not interrupt with non-emergency alerts.",
  "final_message": null,  // null if SILENT or DEFER
  "defer_seconds": 300,
  "audit_log": "User in deep sleep mode. Battery alert deferred 5 minutes."
}
```

**Agent Logic - The Golden Rules**:
1. **User Safety > User Comfort > Battery Life**
   - Never silence a real emergency, even if user is busy
   - Never interrupt meditation/sleep for low-urgency alerts
   
2. **Smart Interruption Management**
   - Battery critical + navigating? → DEFER (don't interrupt driving)
   - HR spike + meditating? → DEFER (could be intentional breathing)
   - Low battery + deep focus app? → DEFER (will notify after focus ends)

3. **Context-Aware Conflict Resolution**
   - If battery low AND navigating AND HR normal → silently log, don't alert
   - If HR spike + completely still + unfamiliar location → ESCALATE to emergency
   - If any flag is "critical" + not in deep focus → escalate at least to NOTIFY_HIGH

**Integration**:
- Hook into: `from agents.arbiter import run_arbiter`
- Pass: proposed action, profile, telemetry
- Get: final decision dict with override details

---

## 📊 Complete Agent Pipeline

```
Sensor Data (every 10s)
    ↓
[PROFILER] → "What is user doing?" → Context Profile
    ↓
[ACTION AGENT] → "What should we do?" → Action Proposal
    ↓
[ARBITER] → "Is this actually smart?" → Final Decision
    ↓
Log Decision + Push to Frontend
    ↓
Dashboard Updates in Real-time
```

**Frequency**: Every 10 seconds
**Latency**: ~2-3 seconds for full pipeline (mostly OpenAI API calls)

---

## 🔌 Integration Guide

### Option 1: Custom Wearable Data Source

**Replace the telemetry source** by modifying `server/main.py`:

```python
# Current: receives from phone via POST /data
# To integrate Fitbit, Apple Watch, etc:

@app.post("/data")
async def ingest(payload: dict):
    # Transform external format to standard format
    standardized = {
        "timestamp": payload["time"],
        "heart_rate": payload["hr"],  # your field name
        "battery": payload["batt"],
        "steps": payload["step_count"],
        "location": payload["loc"]
    }
    telemetry_window.append(standardized)
    return {"ok": True}
```

**Example: Integrate with Fitbit API**
```python
import httpx

async def fetch_fitbit_data():
    """Fetch from Fitbit API instead of waiting for POST"""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://api.fitbit.com/1/user/-/activities.json",
            headers={"Authorization": f"Bearer {FITBIT_TOKEN}"}
        )
        fitbit_data = resp.json()
        # Transform and append
        telemetry_window.append(transform_fitbit(fitbit_data))
```

### Option 2: Custom Decision Handler

**Instead of just showing decisions on dashboard, execute them**:

```python
# Add to server/main.py after arbiter decision

from agents.arbiter import run_arbiter

final_decision = run_arbiter(proposed, profile, latest)

# NOW: Execute the decision
if final_decision["final_action"] == "EMERGENCY_PROTOCOL":
    await send_sms_to_emergency_contacts(final_decision["final_message"])
    await trigger_gps_share()
elif final_decision["final_action"] == "NOTIFY_HIGH":
    await send_push_notification(device_id, final_decision["final_message"])
elif final_decision["final_action"] == "NOTIFY_LOW":
    await send_silent_notification(device_id, final_decision["final_message"])

# Log to external system
await send_to_healthkit(final_decision["audit_log"])
```

### Option 3: Custom Agent Logic

**Replace or extend the AI agents** with your own logic:

```python
# Instead of LangChain/OpenAI, use custom logic

def run_profiler_custom(telemetry_window):
    """Your own ML model or rule-based logic"""
    latest = telemetry_window[-1]
    
    # Example: ML model
    activity = ml_model.predict_activity(telemetry_window)
    stress = stress_classifier.predict(latest["heart_rate"])
    
    return {
        "activity": activity,
        "stress_level": stress,
        "location_familiarity": "home",  # from GPS
        "vulnerability_score": calculate_risk(activity, stress),
        "context_summary": f"User {activity} with {stress} stress",
        "flags": detect_flags(telemetry_window)
    }
```

### Option 4: Webhook Callbacks

**Send decisions to external services**:

```python
# Add to orchestrator.py

async def publish_decision_webhook(decision: dict):
    """Send decision to external systems"""
    webhooks = [
        "https://your-health-platform.com/decisions",
        "https://your-emergency-service.com/alerts",
        "https://your-analytics-service.com/events"
    ]
    
    for webhook in webhooks:
        await client.post(webhook, json=decision)
```

### Option 5: Stream to Message Queue

**For high-scale systems, publish to Kafka/RabbitMQ**:

```python
import aio_pika

async def publish_to_kafka(decision: dict):
    connection = await aio_pika.connect_robust("amqp://guest:guest@localhost/")
    channel = await connection.channel()
    exchange = await channel.declare_exchange("wearable_decisions", aio_pika.ExchangeType.TOPIC)
    
    await exchange.publish(
        aio_pika.Message(body=json.dumps(decision).encode()),
        routing_key="decision.made"
    )
```

---

## 📡 API Endpoints

### GET `/api/decisions`
Returns latest decisions

**Response**:
```json
[
  {
    "timestamp": 1703089935.123,
    "telemetry_snapshot": { "heart_rate": 92, "battery": 45 },
    "profile": { "activity": "walking", "stress_level": "low" },
    "action_proposed": { "action": "SILENT" },
    "arbiter_final": { "final_action": "SILENT", "overrode_action_agent": false },
    "overrode": false
  }
]
```

### GET `/api/telemetry`
Returns latest telemetry readings

**Response**:
```json
[
  { "timestamp": "2026-04-25T14:32:35Z", "heart_rate": 95, "battery": 45, "steps": 1270 },
  { "timestamp": "2026-04-25T14:32:25Z", "heart_rate": 92, "battery": 45, "steps": 1265 }
]
```

### POST `/data`
Ingest new telemetry data

**Request**:
```json
{
  "timestamp": "2026-04-25T14:32:45Z",
  "heart_rate": 98,
  "battery": 44,
  "steps": 1275,
  "location": "familiar"
}
```

**Response**: `{"ok": true}`

---

## 🏗️ Architecture

```
wearable-brain/
├── frontend/               # Next.js dashboard
│   ├── app/               # Page layout & structure
│   ├── components/        # React components
│   │   ├── dashboard/     # Main dashboard
│   │   ├── telemetry/     # HR, battery, steps display
│   │   ├── decisions/     # Decision log feed
│   │   └── layout/        # Sidebar, top bar
│   ├── hooks/            # useDecisions, useTelemetry (polling)
│   └── lib/              # API calls, types, constants
│
├── server/               # FastAPI backend
│   ├── main.py          # FastAPI app, routes, middleware
│   ├── stream_receiver.py # (Optional) external stream input
│   └── agents/          # AI agents
│       ├── profiler.py  # Context understanding
│       ├── action.py    # Decision proposal
│       ├── arbiter.py   # Final authority
│       └── orchestrator.py # Main loop tying agents together
│
└── agents/              # (Redundant) Agent definitions
```

---

## 🎨 Frontend Architecture

- **`app/page.tsx`** → Main dashboard layout
- **`lib/api.ts`** → All backend calls centralized
- **`hooks/useDecisions.ts`** → Polls `/api/decisions` every 5 seconds
- **`hooks/useTelemetry.ts`** → Polls `/api/telemetry` every 5 seconds
- **`components/telemetry/`** → Renders heart rate, battery, steps with live charts
- **`components/decisions/`** → Renders decision feed with color coding
- **`components/inject/`** → Test buttons (inject scenarios)
- **`lib/constants.ts`** → Test data payloads (edit here to test different scenarios)

---

## 🎨 Decision Color Coding

- 🔴 **EMERGENCY** → Red (EMERGENCY_PROTOCOL)
- 🟠 **Overridden** → Amber (arbiter changed action agent's decision)
- ⚫ **SILENT** → Gray (no action needed)
- 🔵 **Default** → Teal (NOTIFY_LOW/NOTIFY_HIGH)

---

## 🧪 Testing

### Inject Test Scenarios

Click buttons in the dashboard to inject test telemetry:
1. **Normal** → Heart rate 75, battery 50%, calm
2. **Elevated HR** → Heart rate 120, battery 45%, walking
3. **Battery Critical** → Heart rate 80, battery 5%, navigating
4. **Emergency** → Heart rate 160, battery 20%, unfamiliar location

Each injection triggers the full agent pipeline.

### Modify Test Data

Edit [wearable-brain/frontend/lib/constants.ts](wearable-brain/frontend/lib/constants.ts) to change test payloads.

---

## 🔑 Environment Variables

Create `.env` in `wearable-brain/server/`:
```bash
OPENAI_API_KEY=sk-...  # Required for AI agents
```

---

## 📝 License

MIT


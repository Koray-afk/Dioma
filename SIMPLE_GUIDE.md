# 🧠 Wearable Brain - Simple Explanation

## What Is This?

Imagine your smartwatch is **smart enough to think for itself**. This project is an AI-powered decision-making system that:
- **Reads** data from a wearable device (heart rate, steps, battery, location, etc.)
- **Analyzes** what you're doing and how stressed/busy you are
- **Decides** whether to notify you, alert emergency contacts, or stay silent
- **Shows** everything on a beautiful dashboard in real-time

---

## The Complete Flow (Simplest Version)

```
┌─────────────────┐
│  Wearable (Phone│
│  or Smartwatch) │
└────────┬────────┘
         │ Heart rate, steps, battery, location
         ▼
┌─────────────────────────┐
│   Backend Server        │
│  (FastAPI on port 8000) │
└────────┬────────────────┘
         │
         ▼
    🤖 THREE AGENTS ANALYZE DATA (Every 10 seconds)
         │
    ┌────┴─────────────────────┬──────────────────┐
    ▼                           ▼                  ▼
 PROFILER              ACTION AGENT            ARBITER
    │                      │                      │
┌───────────┐         ┌──────────┐          ┌──────────┐
│ "What are │         │ "Should  │          │ "Is this│
│  they up  │         │ we do    │          │ decision│
│  to?"     │         │ something│          │ actually│
│           │         │ about    │          │ good?"  │
│ - Walking │         │ this?"   │          │          │
│ - Stressed│         │          │          │ - Don't  │
│ - Home    │         │ - Alert? │          │  interrupt│
└───────────┘         │ - Silent?│          │  if user │
                      │ - SOS?   │          │  sleeping│
                      └──────────┘          └──────────┘
                           │                      │
                           └──────────┬───────────┘
                                      ▼
                          ✅ FINAL DECISION
                          (Show in dashboard)
                                      │
         ┌────────────────────────────┴─────────────────┐
         ▼                                               ▼
    📱 DASHBOARD                                  📊 Real-time Data
    (http://localhost:3000)                      (API on port 8000)
```

---

## What Each Agent Does

### 🎯 **PROFILER** - Understands the Context
**Question:** *"What is the user doing RIGHT NOW?"*

Looks at the last 30 seconds of data and answers:
- **Activity**: Are they sleeping? Walking? Exercising? Navigating?
- **Stress Level**: Are they calm, medium stressed, or in crisis?
- **Location**: Are they home, somewhere familiar, or somewhere new?
- **Red Flags**: Did heart rate spike? Is battery critically low? Are they completely still?

**Output**: A clear picture of "the user is exercising at home with slightly elevated HR"

---

### ⚡ **ACTION AGENT** - Proposes What to Do
**Question:** *"Should we do something about this?"*

Looks at the profile and says:
- **SILENT** → Do nothing
- **NOTIFY_LOW** → Send a gentle notification
- **NOTIFY_HIGH** → Vibrate + sound alert
- **EMERGENCY_PROTOCOL** → Alert emergency contacts, share GPS
- **DEFER_RECHECK** → Wait 10 seconds and check again

It also rates urgency (1-10) and explains why.

**Example**: "HR spike + still body + home = probably nothing, but high urgency if alone"

---

### ⚖️ **ARBITER** - Makes the Final Call
**Question:** *"Wait... is this actually a good decision?"*

The final decision-maker that overrides the Action Agent if needed. It has **real-world wisdom**:

**Golden Rules:**
- ❌ Never interrupt someone meditating/praying/sleeping unless it's an emergency
- ❌ Never silence a real emergency just because they're busy
- ✅ User safety > User comfort > Battery life > Notification cleanliness
- ✅ If battery is critically low AND they're navigating → silently save the alert, don't interrupt

**Example**: 
- Action Agent says: "Send notification about low battery"
- Arbiter sees: User is deep in meditation (meditation app active)
- Arbiter overrides: "DEFER — check again in 5 minutes"

---

## What You See on the Dashboard

### 📊 **Real-time Telemetry**
- Heart rate graph (live)
- Steps counter
- Battery percentage
- Location

### 📋 **Decision Feed**
A live log of every decision made:
```
14:32:15 | Profile: User resting at home, low stress | Action: SILENT (nothing to worry about)
14:32:25 | Profile: User now walking, HR elevated | Action: NOTIFY_LOW (gentle reminder to check HR)
14:32:35 | Profile: User sleeping | Action: SILENT + DEFER (override: don't interrupt sleep)
```

For each decision, you see:
- **What the device sensed** (telemetry snapshot)
- **What the profile concluded** (activity, stress, flags)
- **What the action agent proposed** (action + urgency)
- **What the arbiter decided** (final action + whether it overrode)
- **Why** (the reasoning)

---

## Real-World Examples

### Example 1: False Alarm
```
🔴 Heart rate suddenly spikes to 120 BPM
PROFILER: "HR elevated, but user is exercising at home"
ACTION: "NOTIFY_HIGH - might be a problem"
ARBITER: "Wait... they're in their home gym. Context says exercising. OVERRIDE → SILENT"
RESULT: ✅ No notification. Crisis avoided.
```

### Example 2: Real Emergency
```
🔴 Heart rate 160 + completely still + unfamiliar location
PROFILER: "HR spike + still body + unfamiliar place = HIGH vulnerability"
ACTION: "EMERGENCY_PROTOCOL"
ARBITER: "This is real. Don't override. EMERGENCY_PROTOCOL"
RESULT: ✅ SOS triggered. Emergency contacts notified. GPS shared.
```

### Example 3: Smart Interruption Management
```
🔴 Battery at 3%
PROFILER: "Battery critical + user actively navigating"
ACTION: "NOTIFY_HIGH - charge now!"
ARBITER: "They're navigating. If I alert now, they might miss turn. DEFER silently"
RESULT: ✅ Alert saved internally. Will notify when navigation ends.
```

---

## How to Run It

### **Backend** (Python + FastAPI)
```bash
cd wearable-brain/server
source /Users/abhimansingh/Desktop/Dioma/.venv/bin/activate
uvicorn main:app --reload
```
Runs on: **http://localhost:8000**
- API endpoint: `http://localhost:8000/api/decisions` (latest decisions)
- API endpoint: `http://localhost:8000/api/telemetry` (latest sensor data)

### **Frontend** (Next.js + React)
```bash
cd wearable-brain/frontend
npm run dev
```
Runs on: **http://localhost:3000**
- Open in browser → see live dashboard

---

## What Data Flows Through

**INTO the system:**
- ❤️ Heart rate
- 👣 Step count
- 🔋 Battery %
- 📍 Location (familiar/unfamiliar)
- 📱 Current activity (app in focus)
- ⏰ Timestamps

**OUT of the system:**
- 🎯 Context profile (what the user is doing)
- 📊 Decision log (what action was taken and why)
- 📈 Telemetry history (last 30 data points)
- 🎨 Real-time dashboard visualization

---

## Key Insight: Why This Is Smart

Most smartwatches are **dumb decision-makers**:
- "HR > 100? NOTIFY!"
- "Battery < 20%? SCREAM!"

This system is **context-aware**:
- "HR > 100 AND they're exercising? Silent."
- "Battery low AND navigating? Defer. AND meditating? Definitely defer."

It **learns the rules** that should apply (no interrupting sleep, no ignoring emergencies) and applies them every time.

---

## Quick Checklist

- ✅ Backend running? (FastAPI on 8000)
- ✅ Frontend running? (Next.js on 3000)  
- ✅ Can see dashboard? (http://localhost:3000)
- ✅ Decisions showing up in real-time? (Check "Decision Feed")

You're good to go! 🚀

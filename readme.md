# Arbiter Dashboard

Real-time telemetry and AI decision monitoring dashboard for the Wearable Brain project.

## Setup

```bash
npm install
npm run dev   # starts on http://localhost:3000
```

## Backend

Requires FastAPI server running on `http://localhost:8000`

Start with:
```bash
cd server && uvicorn main:app --reload
```

If you see `ModuleNotFoundError: No module named 'agents'`, make sure the server has:
```bash
server/agents/__init__.py
server/agents/orchestrator.py
```

The backend should expose these routes:
- `GET /api/telemetry`
- `GET /api/decisions`
- `POST /data`

## Architecture

- `app/page.tsx` → main dashboard
- `lib/api.ts` → all backend calls
- `hooks/use*.ts` → polling hooks (5s interval)
- `components/telemetry/` → HR, battery, steps UI
- `components/decisions/` → decision log feed
- `components/inject/` → scenario injection buttons
- `lib/constants.ts` → scenario payloads (edit here to change test data)

## Decision color coding

- **EMERGENCY** → red
- **Overridden** → amber
- **SILENT** → gray
- **Default** → teal


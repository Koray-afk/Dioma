"""Combined API."""
# server/main.py — single FastAPI app combining both tracks
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from agents.orchestrator import agent_loop, get_latest_decisions, telemetry_window
import asyncio

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], 
                   allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
async def start_agents():
    asyncio.create_task(agent_loop())

@app.get("/api/decisions")
def decisions():
    return get_latest_decisions(20)

@app.get("/api/telemetry")
def telemetry():
    return list(telemetry_window)[-20:]

@app.post("/data")           # Phone posts here
async def ingest(payload: dict):
    telemetry_window.append(payload)
    return {"ok": True}
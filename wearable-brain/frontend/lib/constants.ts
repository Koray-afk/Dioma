export const POLL_INTERVAL = 5000;

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const SCENARIO_PAYLOADS = {
  emergency: {
    heart_rate: 180,
    battery: 72,
    steps: 400,
    scenario: "emergency",
  },
  lowBatteryNav: {
    heart_rate: 78,
    battery: 8,
    steps: 120,
    scenario: "low_battery_nav",
  },
  meditation: {
    heart_rate: 52,
    battery: 65,
    steps: 10,
    scenario: "meditation",
  },
} as const;

// Backward-compatible aliases for existing hooks.
export const API_BASE_URL = API_BASE;
export const POLL_INTERVAL_MS = POLL_INTERVAL;

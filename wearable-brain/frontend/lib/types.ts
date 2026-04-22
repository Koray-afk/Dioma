export type TelemetryPoint = {
  timestamp?: string;
  heart_rate?: number;
  steps?: number;
  battery?: number;
  stress?: number;
  [key: string]: unknown;
};

export type DecisionItem = {
  id?: string;
  action?: string;
  reason?: string;
  confidence?: number;
  created_at?: string;
  [key: string]: unknown;
};

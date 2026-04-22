export interface TelemetryPoint {
  timestamp: string;
  heart_rate?: number;
  battery?: number;
  steps?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Decision {
  id?: string;
  timestamp?: string;
  action: string;
  reason?: string;
  overridden?: boolean;
  source?: string;
}

// Backward-compatible alias for existing components.
export type DecisionItem = Decision;

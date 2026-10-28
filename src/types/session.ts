export type SessionState =
  | "idle"
  | "lighting"
  | "ready"
  | "inhaling"
  | "recovering"
  | "completed"
  | "paused";

export type SessionAction =
  | { type: "LIGHT" }
  | { type: "LIGHT_COMPLETE" }
  | { type: "INHALE" }
  | { type: "INHALE_PROGRESS"; progress: number }
  | { type: "INHALE_COMPLETE" }
  | { type: "RECOVER_COMPLETE" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "FINISH_EARLY" }
  | { type: "EXIT" }
  | { type: "RESET"; brandId?: string; totalDraws?: number; environmentId?: string };

export interface SessionContext {
  brandId: string;
  totalDraws: number; // 6 or 7
  currentDraw: number;
  state: SessionState;
  previousState?: SessionState;
  environmentId: string;
  startTime: number | null;
  endTime: number | null;
  elapsedSeconds: number;
}

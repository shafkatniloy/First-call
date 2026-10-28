import { SessionAction, SessionContext, SessionState } from "@/types/session";
import { APP_CONFIG } from "@/config/app.config";

export const initialSessionContext = (
  brandId: string = APP_CONFIG.defaults.brandId,
  totalDraws: number = APP_CONFIG.defaults.totalDraws,
  environmentId: string = APP_CONFIG.defaults.environmentId
): SessionContext => ({
  brandId,
  totalDraws,
  currentDraw: 0,
  state: "idle",
  previousState: undefined,
  environmentId,
  startTime: null,
  endTime: null,
  elapsedSeconds: 0,
});

export function sessionReducer(
  context: SessionContext,
  action: SessionAction
): SessionContext {
  switch (action.type) {
    case "LIGHT": {
      if (context.state !== "idle") return context;
      return {
        ...context,
        state: "lighting",
        startTime: context.startTime ?? Date.now(),
      };
    }

    case "LIGHT_COMPLETE": {
      if (context.state !== "lighting") return context;
      return {
        ...context,
        state: "ready",
      };
    }

    case "INHALE": {
      // Must be in ready state only. Reject duplicate clicks if already inhaling or recovering.
      if (context.state !== "ready") return context;
      return {
        ...context,
        state: "inhaling",
        startTime: context.startTime ?? Date.now(),
      };
    }

    case "INHALE_COMPLETE": {
      if (context.state !== "inhaling") return context;
      return {
        ...context,
        state: "recovering",
      };
    }

    case "RECOVER_COMPLETE": {
      if (context.state !== "recovering") return context;
      const nextDraw = context.currentDraw + 1;
      const isFinished = nextDraw >= context.totalDraws;

      return {
        ...context,
        currentDraw: nextDraw,
        state: isFinished ? "completed" : "ready",
        endTime: isFinished ? Date.now() : context.endTime,
      };
    }

    case "PAUSE": {
      if (context.state === "completed" || context.state === "paused") return context;
      return {
        ...context,
        state: "paused",
        previousState: context.state,
      };
    }

    case "RESUME": {
      if (context.state !== "paused") return context;
      return {
        ...context,
        state: context.previousState || "ready",
        previousState: undefined,
      };
    }

    case "FINISH_EARLY": {
      if (context.state === "completed") return context;
      return {
        ...context,
        state: "completed",
        endTime: Date.now(),
      };
    }

    case "RESET": {
      return initialSessionContext(
        action.brandId || context.brandId,
        action.totalDraws || context.totalDraws,
        action.environmentId || context.environmentId
      );
    }

    default:
      return context;
  }
}

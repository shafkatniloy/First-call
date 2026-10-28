import { describe, it, expect } from "vitest";
import { sessionReducer, initialSessionContext } from "@/features/session/sessionStateMachine";

describe("Session State Machine", () => {
  it("initializes with idle state and 0 draws", () => {
    const ctx = initialSessionContext("marlboro", 7, "rainy-window");
    expect(ctx.state).toBe("idle");
    expect(ctx.currentDraw).toBe(0);
    expect(ctx.totalDraws).toBe(7);
    expect(ctx.brandId).toBe("marlboro");
  });

  it("transitions from idle -> lighting -> ready on valid triggers", () => {
    let ctx = initialSessionContext("navy", 6, "clear-evening");
    expect(ctx.state).toBe("idle");

    // Light
    ctx = sessionReducer(ctx, { type: "LIGHT" });
    expect(ctx.state).toBe("lighting");
    expect(ctx.startTime).toBeTypeOf("number");

    // Complete lighting animation
    ctx = sessionReducer(ctx, { type: "LIGHT_COMPLETE" });
    expect(ctx.state).toBe("ready");
  });

  it("handles a single inhale-recover draw cycle and increments draw count", () => {
    let ctx = initialSessionContext("marise", 7, "rainy-window");
    ctx = sessionReducer(ctx, { type: "LIGHT" });
    ctx = sessionReducer(ctx, { type: "LIGHT_COMPLETE" });
    expect(ctx.state).toBe("ready");
    expect(ctx.currentDraw).toBe(0);

    // Inhale
    ctx = sessionReducer(ctx, { type: "INHALE" });
    expect(ctx.state).toBe("inhaling");

    // Inhale complete -> recovering
    ctx = sessionReducer(ctx, { type: "INHALE_COMPLETE" });
    expect(ctx.state).toBe("recovering");

    // Recover complete -> ready with draw count incremented
    ctx = sessionReducer(ctx, { type: "RECOVER_COMPLETE" });
    expect(ctx.state).toBe("ready");
    expect(ctx.currentDraw).toBe(1);
  });

  it("strictly prevents duplicate clicks while inhaling or recovering", () => {
    let ctx = initialSessionContext("marlboro", 7, "rainy-window");
    ctx = sessionReducer(ctx, { type: "LIGHT" });
    ctx = sessionReducer(ctx, { type: "LIGHT_COMPLETE" });
    ctx = sessionReducer(ctx, { type: "INHALE" });
    expect(ctx.state).toBe("inhaling");

    // Attempt second inhale while already inhaling
    const doubleClickCtx = sessionReducer(ctx, { type: "INHALE" });
    expect(doubleClickCtx.state).toBe("inhaling");
    expect(doubleClickCtx).toEqual(ctx);

    // Move to recovering
    ctx = sessionReducer(ctx, { type: "INHALE_COMPLETE" });
    expect(ctx.state).toBe("recovering");

    // Attempt inhale while recovering
    const spamCtx = sessionReducer(ctx, { type: "INHALE" });
    expect(spamCtx.state).toBe("recovering");
    expect(spamCtx).toEqual(ctx);
  });

  it("completes session exactly when the total draws count is reached", () => {
    const totalDraws = 6;
    let ctx = initialSessionContext("gold-leaf", totalDraws, "foggy-night");
    ctx = sessionReducer(ctx, { type: "LIGHT" });
    ctx = sessionReducer(ctx, { type: "LIGHT_COMPLETE" });

    for (let i = 0; i < totalDraws; i++) {
      ctx = sessionReducer(ctx, { type: "INHALE" });
      ctx = sessionReducer(ctx, { type: "INHALE_COMPLETE" });
      ctx = sessionReducer(ctx, { type: "RECOVER_COMPLETE" });
    }

    expect(ctx.currentDraw).toBe(totalDraws);
    expect(ctx.state).toBe("completed");
    expect(ctx.endTime).toBeTypeOf("number");
  });

  it("handles pause and resume properly preserving state context", () => {
    let ctx = initialSessionContext("navy", 7, "rainy-window");
    ctx = sessionReducer(ctx, { type: "LIGHT" });
    ctx = sessionReducer(ctx, { type: "LIGHT_COMPLETE" });
    expect(ctx.state).toBe("ready");

    // Pause
    ctx = sessionReducer(ctx, { type: "PAUSE" });
    expect(ctx.state).toBe("paused");
    expect(ctx.previousState).toBe("ready");

    // Resume
    ctx = sessionReducer(ctx, { type: "RESUME" });
    expect(ctx.state).toBe("ready");
    expect(ctx.previousState).toBeUndefined();
  });

  it("allows early finishing anytime", () => {
    let ctx = initialSessionContext("marise", 7, "rainy-window");
    ctx = sessionReducer(ctx, { type: "LIGHT" });
    ctx = sessionReducer(ctx, { type: "LIGHT_COMPLETE" });
    ctx = sessionReducer(ctx, { type: "INHALE" });

    // Early finish
    ctx = sessionReducer(ctx, { type: "FINISH_EARLY" });
    expect(ctx.state).toBe("completed");
    expect(ctx.endTime).toBeTypeOf("number");
  });
});

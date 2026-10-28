"use client";

import React, { useReducer, useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { sessionReducer, initialSessionContext } from "@/features/session/sessionStateMachine";
import { getBrandById } from "@/config/brands.config";
import { getEnvironmentById } from "@/config/environments.config";
import { APP_CONFIG } from "@/config/app.config";
import { audioManager } from "@/features/audio/audioManager";
import { StorageManager } from "@/lib/storage/localStorage";
import { ImmersiveScene } from "@/components/immersive-scene/ImmersiveScene";
import { SessionHUD } from "@/components/session-controls/SessionHUD";
import { SessionCompletion } from "@/components/session-controls/SessionCompletion";

function SessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read query params or fallback to saved preferences
  const brandParam = searchParams.get("brand") || APP_CONFIG.defaults.brandId;
  const drawsParam = parseInt(searchParams.get("draws") || String(APP_CONFIG.defaults.totalDraws), 10);
  const totalDraws = (drawsParam === 6 ? 6 : 7) as 6 | 7;
  const envParam = searchParams.get("env") || APP_CONFIG.defaults.environmentId;

  const brand = getBrandById(brandParam);
  const environment = getEnvironmentById(envParam);

  const [state, dispatch] = useReducer(
    sessionReducer,
    initialSessionContext(brand.id, totalDraws, environment.id)
  );

  const [isMuted, setIsMuted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Initialize preferences & start ambient sound
  useEffect(() => {
    const prefs = StorageManager.load().preferences;
    setIsMuted(!prefs.soundEnabled);
    audioManager.setMuted(!prefs.soundEnabled);
    audioManager.setMasterVolume(prefs.masterVolume);
    audioManager.setAmbientVolume(prefs.ambientVolume);
    setReducedMotion(prefs.reducedMotion);

    if (prefs.ambientSoundEnabled) {
      audioManager.startAmbient(environment.ambientSound);
    }

    return () => {
      audioManager.stopAmbient();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, [environment.ambientSound]);

  // Track session duration while active
  useEffect(() => {
    if (state.state !== "idle" && state.state !== "completed" && state.state !== "paused") {
      elapsedTimerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    }
    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, [state.state]);

  // Auto-pause when tab changes visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && (state.state === "ready" || state.state === "inhaling")) {
        dispatch({ type: "PAUSE" });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [state.state]);

  // Handle state-specific side effects and animation transitions
  useEffect(() => {
    if (state.state === "lighting") {
      audioManager.playLighter();
      timerRef.current = setTimeout(() => {
        dispatch({ type: "LIGHT_COMPLETE" });
      }, APP_CONFIG.drawDurations.lightingMs);
    } else if (state.state === "inhaling") {
      audioManager.playInhale(APP_CONFIG.drawDurations.inhaleMs / 1000);
      timerRef.current = setTimeout(() => {
        dispatch({ type: "INHALE_COMPLETE" });
      }, APP_CONFIG.drawDurations.inhaleMs);
    } else if (state.state === "recovering") {
      audioManager.playExhale(APP_CONFIG.drawDurations.recoverMs / 1000);
      timerRef.current = setTimeout(() => {
        dispatch({ type: "RECOVER_COMPLETE" });
      }, APP_CONFIG.drawDurations.recoverMs);
    } else if (state.state === "completed") {
      audioManager.playCompletion();
      // Record completed virtual session in storage
      StorageManager.recordVirtualSession(state.currentDraw);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.state, state.currentDraw]);

  // Handlers
  const handleLight = useCallback(() => {
    audioManager.unlock();
    dispatch({ type: "LIGHT" });
  }, []);

  const handleInhale = useCallback(() => {
    audioManager.unlock();
    dispatch({ type: "INHALE" });
  }, []);

  const handlePause = useCallback(() => {
    dispatch({ type: "PAUSE" });
  }, []);

  const handleResume = useCallback(() => {
    dispatch({ type: "RESUME" });
  }, []);

  const handleFinishEarly = useCallback(() => {
    dispatch({ type: "FINISH_EARLY" });
  }, []);

  const handleExit = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      audioManager.setMuted(next);
      StorageManager.updatePreferences({ soundEnabled: !next });
      return next;
    });
  }, []);

  const handleRestart = useCallback(() => {
    setElapsedSeconds(0);
    dispatch({ type: "RESET", brandId: brand.id, totalDraws, environmentId: environment.id });
  }, [brand.id, totalDraws, environment.id]);

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-black select-none">
      {/* 1. Immersive First-Person Scene Viewport */}
      <ImmersiveScene
        state={state.state}
        brand={brand}
        environment={environment}
        currentDraw={state.currentDraw}
        totalDraws={state.totalDraws}
        reducedMotion={reducedMotion}
      />

      {/* 2. Tactical Head-Up Display (HUD) */}
      <SessionHUD
        state={state.state}
        brand={brand}
        environment={environment}
        currentDraw={state.currentDraw}
        totalDraws={state.totalDraws}
        isMuted={isMuted}
        onLight={handleLight}
        onInhale={handleInhale}
        onPause={handlePause}
        onResume={handleResume}
        onFinishEarly={handleFinishEarly}
        onExit={handleExit}
        onToggleMute={handleToggleMute}
      />

      {/* 3. Session Completion Screen */}
      {state.state === "completed" && (
        <SessionCompletion
          brand={brand}
          environment={environment}
          drawsCompleted={state.currentDraw}
          totalDraws={state.totalDraws}
          elapsedSeconds={elapsedSeconds}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="w-screen h-screen bg-charcoal-950 flex items-center justify-center text-neutral-500 font-mono text-xs">Entering ritual scene...</div>}>
      <SessionContent />
    </Suspense>
  );
}

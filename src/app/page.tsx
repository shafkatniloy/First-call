"use client";

import React, { useReducer, useEffect, useRef, useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { sessionReducer, initialSessionContext } from "@/features/session/sessionStateMachine";
import { BRANDS, getBrandById } from "@/config/brands.config";
import { ENVIRONMENTS, getEnvironmentById } from "@/config/environments.config";
import { APP_CONFIG } from "@/config/app.config";
import { audioManager } from "@/features/audio/audioManager";
import { StorageManager } from "@/lib/storage/localStorage";
import { GlassRitualControls } from "@/components/session-controls/GlassRitualControls";
import { SessionCompletion } from "@/components/session-controls/SessionCompletion";
import { UserNameModal } from "@/components/auth/UserNameModal";

const DhakaSceneCanvas = dynamic(
  () =>
    import("@/components/immersive-scene/DhakaSceneCanvas").then(
      (mod) => mod.DhakaSceneCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-charcoal-950 flex flex-col items-center justify-center text-neutral-400 font-mono text-xs gap-2 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Entering Dhaka scene...</span>
        </div>
        <div className="text-[11px] text-neutral-400 font-mono tracking-wide mt-1">
          free server, wait 10 seconds if not responding
        </div>
      </div>
    ),
  }
);

function RitualStartingPageContent() {
  const [selectedBrandId, setSelectedBrandId] = useState<string>("marlboro");
  const [selectedEnvId, setSelectedEnvId] = useState<string>("rainy-window");
  const [drawCount, setDrawCount] = useState<6 | 7>(7);

  const brand = getBrandById(selectedBrandId);
  const environment = getEnvironmentById(selectedEnvId);

  const [state, dispatch] = useReducer(
    sessionReducer,
    initialSessionContext(brand.id, drawCount, environment.id)
  );

  const [isMuted, setIsMuted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Load saved preferences and username on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("vesper_user_name");
    if (savedUser) {
      setUserName(savedUser);
    } else {
      setIsUserModalOpen(true);
    }

    const prefs = StorageManager.load().preferences;
    if (prefs.lastSelectedBrand) setSelectedBrandId(prefs.lastSelectedBrand);
    if (prefs.lastSelectedEnvironment) setSelectedEnvId(prefs.lastSelectedEnvironment);
    if (prefs.preferredDrawCount) setDrawCount(prefs.preferredDrawCount);

    setIsMuted(!prefs.soundEnabled);
    audioManager.setMuted(!prefs.soundEnabled);
    audioManager.setMasterVolume(prefs.masterVolume);
    audioManager.setAmbientVolume(prefs.ambientVolume);
    setReducedMotion(prefs.reducedMotion);

    if (prefs.ambientSoundEnabled && prefs.soundEnabled) {
      audioManager.startAmbient(environment.ambientSound);
    }

    return () => {
      audioManager.stopAmbient();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, []);

  // Update ambient soundscape when environment changes
  useEffect(() => {
    const prefs = StorageManager.load().preferences;
    if (prefs.ambientSoundEnabled && prefs.soundEnabled) {
      audioManager.startAmbient(environment.ambientSound);
    }
  }, [environment.ambientSound]);

  // Track session duration while actively smoking
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

  // Auto-pause if tab changes visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && (state.state === "ready" || state.state === "inhaling")) {
        dispatch({ type: "PAUSE" });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [state.state]);

  // Handle ritual state-machine transitions and procedural audio
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
      audioManager.playRandomDrawSound();
      timerRef.current = setTimeout(() => {
        dispatch({ type: "RECOVER_COMPLETE" });
      }, APP_CONFIG.drawDurations.recoverMs);
    } else if (state.state === "completed") {
      audioManager.playCompletion();
      StorageManager.recordVirtualSession(state.currentDraw);

      const activeUser = userName || localStorage.getItem("vesper_user_name");
      if (activeUser) {
        fetch("/api/burns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: activeUser,
            brandId: brand.id,
            brandName: brand.name,
            draws: state.currentDraw,
            durationSeconds: elapsedSeconds,
          }),
        }).catch((err) => console.error("Failed to record burnt cigarette:", err));
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.state, state.currentDraw]);

  // Selection Handlers (Instant Real-time Updates)
  const handleSelectBrand = useCallback((brandId: string) => {
    audioManager.playBrandClick();
    setSelectedBrandId(brandId);
    StorageManager.updatePreferences({ lastSelectedBrand: brandId });
    dispatch({ type: "RESET", brandId, totalDraws: drawCount, environmentId: selectedEnvId });
  }, [drawCount, selectedEnvId]);

  const handleSelectEnvironment = useCallback((envId: string) => {
    audioManager.playClick();
    setSelectedEnvId(envId);
    StorageManager.updatePreferences({ lastSelectedEnvironment: envId });
    dispatch({ type: "RESET", brandId: selectedBrandId, totalDraws: drawCount, environmentId: envId });
  }, [selectedBrandId, drawCount]);

  const handleSelectDrawCount = useCallback((count: 6 | 7) => {
    audioManager.playClick();
    setDrawCount(count);
    StorageManager.updatePreferences({ preferredDrawCount: count });
    dispatch({ type: "RESET", brandId: selectedBrandId, totalDraws: count, environmentId: selectedEnvId });
  }, [selectedBrandId, selectedEnvId]);

  // Ritual Handlers
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

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      audioManager.setMuted(next);
      StorageManager.updatePreferences({ soundEnabled: !next });
      return next;
    });
  }, []);

  const handleToggleMotion = useCallback(() => {
    setReducedMotion((prev) => {
      const next = !prev;
      StorageManager.updatePreferences({ reducedMotion: next });
      return next;
    });
  }, []);

  const handleRestart = useCallback(() => {
    setElapsedSeconds(0);
    dispatch({ type: "RESET", brandId: brand.id, totalDraws: drawCount, environmentId: environment.id });
  }, [brand.id, drawCount, environment.id]);

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-black select-none fixed inset-0">
      {/* 1. Full-Viewport 3D Retro Dhaka Street Experience */}
      <DhakaSceneCanvas
        state={state.state}
        brand={brand}
        environment={environment}
        currentDraw={state.currentDraw}
        totalDraws={state.totalDraws}
        reducedMotion={reducedMotion}
      />

      {/* 2. Glass UI Controls: Brand & Weather Selection + Interactive Ritual Dock */}
      <GlassRitualControls
        state={state.state}
        brand={brand}
        environment={environment}
        allBrands={BRANDS}
        allEnvironments={ENVIRONMENTS}
        drawCount={drawCount}
        currentDraw={state.currentDraw}
        totalDraws={state.totalDraws}
        isMuted={isMuted}
        reducedMotion={reducedMotion}
        currentUserName={userName}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onSelectBrand={handleSelectBrand}
        onSelectEnvironment={handleSelectEnvironment}
        onSelectDrawCount={handleSelectDrawCount}
        onLight={handleLight}
        onInhale={handleInhale}
        onPause={handlePause}
        onResume={handleResume}
        onFinishEarly={handleFinishEarly}
        onToggleMute={handleToggleMute}
        onToggleMotion={handleToggleMotion}
      />

      {/* 3. Session Completion Glass Modal */}
      {state.state === "completed" && (
        <SessionCompletion
          brand={brand}
          environment={environment}
          drawsCompleted={state.currentDraw}
          totalDraws={state.totalDraws}
          elapsedSeconds={elapsedSeconds}
          userName={userName}
          onRestart={handleRestart}
          onHome={handleRestart}
        />
      )}

      {/* 4. Mandatory Unique User Name Registration Modal */}
      <UserNameModal
        isOpen={isUserModalOpen}
        canDismiss={!!userName}
        onSuccess={(name) => {
          setUserName(name);
          localStorage.setItem("vesper_user_name", name);
          setIsUserModalOpen(false);
        }}
        onClose={() => setIsUserModalOpen(false)}
      />
    </main>
  );
}

export default function StartingPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-[100dvh] bg-charcoal-950 flex items-center justify-center text-neutral-400 font-mono text-xs">
          Loading First Call Dhaka Scene...
        </div>
      }
    >
      <RitualStartingPageContent />
    </Suspense>
  );
}

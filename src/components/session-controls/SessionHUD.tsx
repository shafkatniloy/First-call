"use client";

import React, { useEffect } from "react";
import { Volume2, VolumeX, Pause, Play, Flame, X, SkipForward, Wind } from "lucide-react";
import { SessionState } from "@/types/session";
import { BrandConfig } from "@/types/brand";
import { EnvironmentConfig } from "@/types/environment";

interface SessionHUDProps {
  state: SessionState;
  brand: BrandConfig;
  environment: EnvironmentConfig;
  currentDraw: number;
  totalDraws: number;
  isMuted: boolean;
  onLight: () => void;
  onInhale: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinishEarly: () => void;
  onExit: () => void;
  onToggleMute: () => void;
  onChangeEnvironment?: (envId: string) => void;
}

export const SessionHUD: React.FC<SessionHUDProps> = ({
  state,
  brand,
  environment,
  currentDraw,
  totalDraws,
  isMuted,
  onLight,
  onInhale,
  onPause,
  onResume,
  onFinishEarly,
  onExit,
  onToggleMute,
}) => {
  // Global Keyboard listener for Spacebar / Enter / Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        if (state === "idle") {
          onLight();
        } else if (state === "ready") {
          onInhale();
        }
      } else if (e.code === "Escape") {
        if (state === "paused") {
          onResume();
        } else if (state !== "completed") {
          onPause();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, onLight, onInhale, onPause, onResume]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-40">
      {/* 1. Header Bar */}
      <header className="w-full flex items-center justify-between pointer-events-auto">
        {/* Brand & Ritual indicator */}
        <div className="flex items-center gap-3 bg-charcoal-900/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: brand.accentColor }}
          />
          <span className="font-serif text-xs font-semibold tracking-wider text-neutral-200 uppercase">
            {brand.name}
          </span>
          <span className="text-neutral-500 text-xs">|</span>
          <span className="text-[11px] font-sans text-neutral-400">
            {environment.name}
          </span>
        </div>

        {/* Action Controls: Mute, Pause, Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="p-2.5 rounded-full bg-charcoal-900/75 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {state !== "completed" && state !== "paused" && (
            <button
              onClick={onPause}
              aria-label="Pause session"
              className="p-2.5 rounded-full bg-charcoal-900/75 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <Pause size={16} />
            </button>
          )}

          <button
            onClick={onExit}
            aria-label="Exit session"
            className="p-2.5 rounded-full bg-charcoal-900/75 backdrop-blur-md border border-white/10 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <X size={16} />
          </button>
        </div>
      </header>


      {/* 3. Bottom Central Interactive Controls */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 pointer-events-auto mb-2 sm:mb-4">
        {/* Idle State: Light Cigarette */}
        {state === "idle" && (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onLight}
              className="group relative flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-medium text-sm tracking-wider uppercase shadow-ember hover:shadow-ember-intense active:scale-95 transition-all duration-300 border border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <Flame size={18} className="text-amber-200 group-hover:scale-110 transition-transform" />
              <span className="font-bengali font-bold text-base">মাল ধরা</span>
            </button>
            <span className="text-[11px] font-mono text-neutral-400 tracking-wide">
              Press [Space] or Tap to light
            </span>
          </div>
        )}

        {/* Lighting State: In progress */}
        {state === "lighting" && (
          <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-charcoal-900/80 backdrop-blur-md border border-orange-500/40 text-orange-200 text-sm font-bengali tracking-wide animate-pulse">
            <Flame size={15} className="text-orange-400 animate-bounce" />
            <span>সিগারেট ধরানো হচ্ছে...</span>
          </div>
        )}

        {/* Ready State: Inhale Trigger */}
        {state === "ready" && (
          <div className="flex flex-col items-center gap-2 w-full">
            <button
              onClick={onInhale}
              className="group relative w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-charcoal-800/90 via-charcoal-700/90 to-charcoal-800/90 hover:from-amber-950/80 hover:via-charcoal-800/90 hover:to-amber-950/80 text-neutral-100 font-bengali font-bold text-base tracking-wide border border-amber-500/30 hover:border-amber-400/60 shadow-cinematic active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              <Wind size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
              <span>টান দিন</span>
              <span className="text-neutral-400 text-sm ml-1 font-mono">
                ({currentDraw + 1}/{totalDraws})
              </span>
            </button>
            <div className="flex items-center gap-4 text-xs text-neutral-400 font-bengali">
              <span>বাটনে চাপ দিয়ে টান দিন • স্ক্রিন টেনে চারপাশ দেখুন</span>
              <span>•</span>
              <button
                onClick={onFinishEarly}
                className="hover:text-neutral-200 underline decoration-neutral-600 transition-colors cursor-pointer"
              >
                এখানেই শেষ করুন
              </button>
            </div>
          </div>
        )}

        {/* Inhaling State: Non-interactive feedback */}
        {state === "inhaling" && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-amber-950/50 backdrop-blur-md border border-amber-500/50 text-amber-200 text-sm font-bengali tracking-wide shadow-ember animate-pulse">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>গভীর টান নিন...</span>
            </div>
          </div>
        )}

        {/* Recovering State: Exhale feedback */}
        {state === "recovering" && (
          <div className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-charcoal-900/60 backdrop-blur-md border border-neutral-700/50 text-neutral-300 text-xs font-bengali tracking-wide">
            <Wind size={14} className="text-neutral-400 opacity-60" />
            <span>আস্তে ধোঁয়া ছাড়ুন...</span>
          </div>
        )}
      </div>

      {/* 4. Paused Modal Overlay */}
      {state === "paused" && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 pointer-events-auto">
          <div className="w-full max-w-sm bg-charcoal-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
              <Pause size={22} />
            </div>

            <h2 className="font-bengali text-xl font-bold text-white mb-1">
              একটু বিরতি
            </h2>
            <p className="text-xs font-bengali text-neutral-400 mb-6">
              একটু দম নিন। আপনার টান হিসাব সংরক্ষিত আছে ({currentDraw}/{totalDraws})।
            </p>

            <div className="w-full flex flex-col gap-2.5">
              <button
                onClick={onResume}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bengali font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play size={15} />
                <span>আবার টানুন</span>
              </button>

              <button
                onClick={onFinishEarly}
                className="w-full py-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-neutral-200 font-bengali font-bold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 border border-white/5 cursor-pointer"
              >
                <SkipForward size={15} />
                <span>এখানেই শেষ করুন</span>
              </button>

              <button
                onClick={onExit}
                className="w-full py-2.5 rounded-xl text-neutral-400 hover:text-rose-400 font-bengali text-xs transition-colors cursor-pointer"
              >
                দোকানে ফিরুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

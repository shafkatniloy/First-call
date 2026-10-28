"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, RotateCcw, BarChart3, Home, Plus, Check } from "lucide-react";
import { BrandConfig } from "@/types/brand";
import { EnvironmentConfig } from "@/types/environment";
import { StorageManager } from "@/lib/storage/localStorage";

interface SessionCompletionProps {
  brand: BrandConfig;
  environment: EnvironmentConfig;
  drawsCompleted: number;
  totalDraws: number;
  elapsedSeconds: number;
  onRestart: () => void;
}

export const SessionCompletion: React.FC<SessionCompletionProps> = ({
  brand,
  environment,
  drawsCompleted,
  totalDraws,
  elapsedSeconds,
  onRestart,
}) => {
  const [loggedRealCig, setLoggedRealCig] = useState(false);
  const [realCountInput, setRealCountInput] = useState<number>(0);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    if (mins === 0) return `${remainder}s`;
    return `${mins}m ${remainder}s`;
  };

  const handleLogReal = (countDelta: number) => {
    const today = StorageManager.getOrCreateTodayEntry();
    const updated = StorageManager.updateRealCigarettes(today.realCigarettes + countDelta);
    setRealCountInput(updated.realCigarettes);
    setLoggedRealCig(true);
  };

  return (
    <div className="fixed inset-0 bg-charcoal-950/95 backdrop-blur-xl flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-lg bg-charcoal-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center my-auto">
        {/* Completion Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center mb-5 text-amber-400 shadow-ember">
          <CheckCircle2 size={32} />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 tracking-wide">
          Ritual Completed
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mb-6 leading-relaxed">
          You successfully completed your hand-to-mouth pause. No combustion, no tar, no nicotine intake.
        </p>

        {/* Session Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-3 mb-6">
          <div className="bg-charcoal-850 p-3.5 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">
              Draws
            </span>
            <span className="text-lg font-mono font-bold text-amber-300 mt-1">
              {drawsCompleted}/{totalDraws}
            </span>
          </div>

          <div className="bg-charcoal-850 p-3.5 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">
              Duration
            </span>
            <span className="text-lg font-mono font-bold text-neutral-200 mt-1">
              {formatDuration(elapsedSeconds)}
            </span>
          </div>

          <div className="bg-charcoal-850 p-3.5 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">
              Brand
            </span>
            <span className="text-sm font-serif font-semibold text-neutral-200 mt-1 truncate max-w-full">
              {brand.name}
            </span>
          </div>
        </div>

        {/* Optional Harm Reduction Logger */}
        <div className="w-full bg-charcoal-950/60 rounded-2xl p-4 border border-white/5 mb-6 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-300">
              Daily Cigarette Log
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              Optional & Private
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mb-3 leading-normal">
            If you smoked a real cigarette prior to or during this craving, you can record it for reduction tracking.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLogReal(1)}
              className="flex-1 py-2 px-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-neutral-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/5"
            >
              <Plus size={14} />
              <span>Record 1 Real Cig</span>
            </button>

            {loggedRealCig && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <Check size={12} /> Logged
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onRestart}
            className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-ember flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} />
            <span>Another Ritual</span>
          </button>

          <Link
            href="/progress"
            className="w-full sm:flex-1 py-3.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-neutral-200 font-medium text-xs tracking-wider uppercase transition-all border border-white/5 flex items-center justify-center gap-2"
          >
            <BarChart3 size={15} />
            <span>My Progress</span>
          </Link>
        </div>

        <Link
          href="/"
          className="mt-4 text-xs font-mono text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-1.5"
        >
          <Home size={13} />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};

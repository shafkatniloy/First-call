"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, RotateCcw, Trophy, Home, Flame } from "lucide-react";
import { BrandConfig } from "@/types/brand";
import { EnvironmentConfig } from "@/types/environment";

interface SessionCompletionProps {
  brand: BrandConfig;
  environment: EnvironmentConfig;
  drawsCompleted: number;
  totalDraws: number;
  elapsedSeconds: number;
  userName?: string;
  onRestart: () => void;
  onHome?: () => void;
}

export const SessionCompletion: React.FC<SessionCompletionProps> = ({
  brand,
  environment,
  drawsCompleted,
  totalDraws,
  elapsedSeconds,
  userName,
  onRestart,
  onHome,
}) => {
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    if (mins === 0) return `${remainder}s`;
    return `${mins}m ${remainder}s`;
  };

  const handleReturnHome = () => {
    if (onHome) {
      onHome();
    } else if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="fixed inset-0 bg-charcoal-950/95 backdrop-blur-xl flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-lg bg-charcoal-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center my-auto">
        {/* Completion Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center mb-5 text-amber-400 shadow-ember">
          <CheckCircle2 size={32} />
        </div>

        {/* Heading */}
        <h1 className="font-bengali text-2xl sm:text-3xl font-bold text-white mb-2 tracking-wide">
          মজা শেষ, আরেকটা হবে নাকি?
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-sm mb-6 leading-relaxed font-bengali">
          ধোঁয়া ও বিষাক্ত নিকোটিন ছাড়া আপনার বিরতি সফল হয়েছে।
        </p>

        {/* Session Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-3 mb-6">
          <div className="bg-charcoal-850 p-3.5 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-xs font-bengali font-bold text-neutral-400">
              মোট টান
            </span>
            <span className="text-lg font-mono font-bold text-amber-300 mt-1">
              {drawsCompleted}/{totalDraws}
            </span>
          </div>

          <div className="bg-charcoal-850 p-3.5 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-xs font-bengali font-bold text-neutral-400">
              সময়
            </span>
            <span className="text-lg font-mono font-bold text-neutral-200 mt-1">
              {formatDuration(elapsedSeconds)}
            </span>
          </div>

          <div className="bg-charcoal-850 p-3.5 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-xs font-bengali font-bold text-neutral-400">
              সিগারেট
            </span>
            <span className="text-sm font-serif font-semibold text-neutral-200 mt-1 truncate max-w-full">
              {brand.name}
            </span>
          </div>
        </div>

        {/* Leaderboard Burn Confirmation Banner */}
        {userName && (
          <div className="w-full mb-5 py-2.5 px-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs font-bengali text-amber-300 flex items-center justify-center gap-2 shadow-sm">
            <Flame size={15} className="text-orange-500 animate-pulse shrink-0" />
            <span>
              <strong>@{userName}</strong> এর লিডারবোর্ড হিসাবে এই সিগারেটটি যুক্ত হয়েছে!
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onRestart}
            className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bengali font-bold text-base tracking-wide transition-all shadow-ember flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw size={16} />
            <span>আরেকটা ধরা</span>
          </button>

          <Link
            href="/leaderboard"
            className="w-full sm:flex-1 py-3.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-neutral-200 font-bengali font-bold text-sm tracking-wide transition-all border border-white/5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trophy size={16} className="text-amber-400" />
            <span>লিডারবোর্ড</span>
          </Link>
        </div>

        <button
          onClick={handleReturnHome}
          className="mt-4 text-xs font-bengali font-semibold text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-white/5"
        >
          <Home size={14} />
          <span>দোকানে ফিরুন</span>
        </button>
      </div>
    </div>
  );
};

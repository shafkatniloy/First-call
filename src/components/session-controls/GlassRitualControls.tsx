"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  Wind,
  Volume2,
  VolumeX,
  Eye,
  BarChart3,
  CloudRain,
  CloudFog,
  Moon,
  Sun,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Trophy,
  User,
} from "lucide-react";
import { BrandConfig } from "@/types/brand";
import { EnvironmentConfig } from "@/types/environment";
import { SessionState } from "@/types/session";

interface GlassRitualControlsProps {
  state: SessionState;
  brand: BrandConfig;
  environment: EnvironmentConfig;
  allBrands: BrandConfig[];
  allEnvironments: EnvironmentConfig[];
  drawCount: 6 | 7;
  currentDraw: number;
  totalDraws: number;
  isMuted: boolean;
  reducedMotion: boolean;
  currentUserName?: string;
  onOpenUserModal?: () => void;
  onSelectBrand: (brandId: string) => void;
  onSelectEnvironment: (envId: string) => void;
  onSelectDrawCount: (count: 6 | 7) => void;
  onLight: () => void;
  onInhale: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinishEarly: () => void;
  onToggleMute: () => void;
  onToggleMotion: () => void;
}

export const GlassRitualControls: React.FC<GlassRitualControlsProps> = ({
  state,
  brand,
  environment,
  allBrands,
  allEnvironments,
  drawCount,
  currentDraw,
  totalDraws,
  isMuted,
  reducedMotion,
  currentUserName,
  onOpenUserModal,
  onSelectBrand,
  onSelectEnvironment,
  onSelectDrawCount,
  onLight,
  onInhale,
  onPause,
  onResume,
  onFinishEarly,
  onToggleMute,
  onToggleMotion,
}) => {
  const [showOptionsTray, setShowOptionsTray] = useState(true);

  // Keyboard shortcut: Space to Light or Inhale
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (state === "idle") {
          if (!currentUserName && onOpenUserModal) {
            onOpenUserModal();
          } else {
            onLight();
          }
        } else if (state === "ready") {
          onInhale();
        }
      } else if (e.code === "Escape") {
        if (state === "paused") {
          onResume();
        } else if (state !== "completed" && state !== "idle") {
          onPause();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, onLight, onInhale, onPause, onResume]);

  const getWeatherIcon = (envId: string) => {
    switch (envId) {
      case "day-clear":
        return <Sun size={13} className="text-amber-400 shrink-0" />;
      case "rainy-window":
        return <CloudRain size={13} className="text-sky-400 shrink-0" />;
      case "foggy-night":
        return <CloudFog size={13} className="text-neutral-300 shrink-0" />;
      case "clear-evening":
      default:
        return <Moon size={13} className="text-amber-300 shrink-0" />;
    }
  };

  const getWeatherLabel = (envId: string) => {
    switch (envId) {
      case "day-clear":
        return "দিন";
      case "rainy-window":
        return "বৃষ্টি";
      case "foggy-night":
        return "কুয়াশা";
      case "clear-evening":
      default:
        return "রাত";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] px-3 sm:px-5 z-40 select-none overflow-hidden max-h-[100dvh]">
      {/* 1. TOP GLASS NAVBAR */}
      <header className="w-full flex items-center justify-between pointer-events-auto gap-2 z-20">
        {/* Left: Branding & Retro FPP Badge + Current User */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal-900/60 backdrop-blur-xl border-t border-white/30 border-x border-white/10 border-b border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_24px_rgba(0,0,0,0.5)]">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-amber-500/40 shadow-sm shrink-0">
              <Image
                src="/assets/brand-icon.jpg"
                alt="First Call"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-serif text-xs font-bold tracking-widest text-white uppercase hidden xs:inline">
              FIRST CALL
            </span>
          </div>

          {/* Active User Pill */}
          {currentUserName ? (
            <button
              onClick={onOpenUserModal}
              title="স্মোকারের নাম পরিবর্তন করুন"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal-900/60 backdrop-blur-xl border-t border-white/30 border-x border-white/10 border-b border-white/10 text-neutral-200 hover:text-white transition-all text-xs font-mono shadow-sm active:scale-95 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
              <span className="font-bold text-amber-300">@{currentUserName}</span>
            </button>
          ) : (
            <button
              onClick={onOpenUserModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-all text-xs font-bengali font-bold shadow-sm active:scale-95 cursor-pointer"
            >
              <User size={13} />
              <span>নাম রেজিস্টার করুন</span>
            </button>
          )}
          {/* Tiny Free Server Note */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-charcoal-900/60 backdrop-blur-xl border border-white/5 text-[10px] text-neutral-400 font-mono tracking-tight select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shrink-0 animate-pulse" />
            <span>free server, wait 10 seconds if not responding</span>
          </div>
        </div>

        {/* Center: Live Setup Pill */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-charcoal-900/50 backdrop-blur-xl border border-white/10 text-xs font-mono text-neutral-300">
          <span
            className="w-2 h-2 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: brand.accentColor }}
          />
          <span className="font-semibold text-white">{brand.name}</span>
          <span className="text-neutral-500">•</span>
          <span className="flex items-center gap-1 text-neutral-300">
            {getWeatherIcon(environment.id)}
            {getWeatherLabel(environment.id)}
          </span>
          <span className="text-neutral-500">•</span>
          <span className="text-amber-400 font-bold">{totalDraws} Draws</span>
        </div>

        {/* Right: Audio, Motion, Leaderboard, and Options Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "শব্দ চালু করুন" : "শব্দ বন্ধ করুন"}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-charcoal-900/60 backdrop-blur-xl border-t border-white/30 border-x border-white/10 border-b border-white/10 text-neutral-300 hover:text-white transition-all text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span className="hidden sm:inline font-bengali text-xs">
              {isMuted ? "শব্দ বন্ধ" : "শব্দ চালু"}
            </span>
          </button>

          {/* Reduced motion toggle */}
          <button
            onClick={onToggleMotion}
            aria-label={reducedMotion ? "Full motion" : "Reduce motion"}
            className={`p-2 rounded-full backdrop-blur-xl border transition-all text-xs flex items-center justify-center shadow-sm active:scale-95 ${
              reducedMotion
                ? "bg-amber-600/30 text-amber-300 border-amber-500/40"
                : "bg-charcoal-900/60 border-t border-white/30 border-x border-white/10 border-b border-white/10 text-neutral-400 hover:text-white"
            }`}
          >
            <Eye size={14} />
          </button>

          {/* Leaderboard link (Formerly Progress/Hisab) */}
          <Link
            href="/leaderboard"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-charcoal-900/60 backdrop-blur-xl border-t border-white/30 border-x border-white/10 border-b border-white/10 text-neutral-300 hover:text-white transition-all text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Trophy size={14} className="text-amber-400" />
            <span className="hidden sm:inline font-bengali text-xs font-bold">লিডারবোর্ড</span>
          </Link>

          {/* Toggle Options Drawer button */}
          <button
            onClick={() => setShowOptionsTray((prev) => !prev)}
            aria-label={showOptionsTray ? "Hide options" : "Show options"}
            className={`p-2 rounded-full backdrop-blur-xl border transition-all text-xs flex items-center justify-center shadow-sm active:scale-95 ${
              showOptionsTray
                ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                : "bg-charcoal-900/60 border-t border-white/30 border-x border-white/10 border-b border-white/10 text-neutral-300 hover:text-white"
            }`}
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </header>

      {/* 2. BOTTOM GLASS CUSTOMIZER & RITUAL HUB */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center pointer-events-auto mb-1 sm:mb-3">
        {/* State: IDLE — Show Complete Glass Customization Dock */}
        {state === "idle" && (
          <div className="w-full flex flex-col items-center gap-3">
            {/* Expandable / Collapsible Glass Customizer Card */}
            {showOptionsTray && (
              <div className="w-full max-h-[58vh] sm:max-h-none overflow-y-auto no-scrollbar rounded-2xl sm:rounded-3xl bg-black/55 backdrop-blur-2xl border-t border-white/35 border-x border-white/15 border-b border-white/10 p-2.5 sm:p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.6),0_18px_36px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Section A: Brand Selection with Pack Images */}
                <div className="mb-2 sm:mb-3">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-xs sm:text-sm font-bengali font-bold tracking-wider text-neutral-200 uppercase flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-400" />
                      মাল কোনটা
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono text-neutral-400 truncate max-w-[180px] sm:max-w-none">
                      {brand.name} • {brand.filterTone}
                    </span>
                  </div>

                  {/* 9 Brand Pack Buttons */}
                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 pt-0.5 px-1 no-scrollbar w-full sm:grid sm:grid-cols-9 sm:overflow-visible touch-pan-x">
                    {allBrands.map((b) => {
                      const isSelected = b.id === brand.id;
                      return (
                        <button
                          key={b.id}
                          onClick={() => onSelectBrand(b.id)}
                          className={`flex flex-col items-center justify-between p-1 sm:p-1.5 rounded-xl transition-all relative overflow-hidden group cursor-pointer shrink-0 w-[4.6rem] sm:w-auto ${
                            isSelected
                              ? "bg-white/25 border-2 border-white/70 shadow-[0_0_18px_rgba(255,255,255,0.25)] ring-1 ring-white/60 scale-[1.03]"
                              : "bg-white/10 hover:bg-white/20 border border-white/15 text-neutral-300 hover:text-white"
                          }`}
                        >
                          {/* Pack PNG Image */}
                          <div className="relative w-10 h-14 sm:w-14 sm:h-20 shrink-0 my-0.5">
                            {b.image ? (
                              <Image
                                src={b.image}
                                alt={b.name}
                                fill
                                className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
                                sizes="(max-width: 640px) 40px, 56px"
                              />
                            ) : (
                              <div
                                className="w-full h-full rounded-md opacity-70"
                                style={{ backgroundColor: b.accentColor }}
                              />
                            )}
                          </div>

                          {/* Brand Label */}
                          <span
                            className={`text-[9px] sm:text-[10px] font-sans font-bold text-center tracking-tight truncate max-w-full leading-tight mt-0.5 ${
                              isSelected ? "text-white" : "text-neutral-300"
                            }`}
                          >
                            {b.name}
                          </span>

                          {/* Active Accent Dot */}
                          {isSelected && (
                            <div
                              className="w-1.5 h-1.5 rounded-full mt-0.5 shadow-sm"
                              style={{ backgroundColor: b.accentColor }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section B: Weather & Draw Count Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
                  {/* Weather Selection */}
                  <div>
                    <span className="block text-xs font-bengali font-bold tracking-wider text-neutral-300 mb-1.5 px-1">
                      ঢাকার আবহাওয়া
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {allEnvironments.map((env) => {
                        const isSelected = env.id === environment.id;
                        return (
                          <button
                            key={env.id}
                            onClick={() => onSelectEnvironment(env.id)}
                            className={`flex items-center justify-center gap-1.5 py-2 px-1 sm:px-2 rounded-xl text-xs font-bengali font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-white/25 border border-white/60 text-white font-bold shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                                : "bg-white/10 hover:bg-white/20 border border-white/15 text-neutral-300 hover:text-white"
                            }`}
                          >
                            {getWeatherIcon(env.id)}
                            <span className="truncate">
                              {getWeatherLabel(env.id)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Draw Count Switch */}
                  <div>
                    <span className="block text-xs font-bengali font-bold tracking-wider text-neutral-300 mb-1.5 px-1">
                      কয় টান মারবেন
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => onSelectDrawCount(7)}
                        className={`py-2 px-2 rounded-xl text-xs font-bengali transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          drawCount === 7
                            ? "bg-white/25 border border-white/60 text-amber-300 font-bold shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                            : "bg-white/10 hover:bg-white/20 border border-white/15 text-neutral-300 hover:text-white"
                        }`}
                      >
                        <span className="font-bold">৭টানে আরামসে খান</span>
                      </button>

                      <button
                        onClick={() => onSelectDrawCount(6)}
                        className={`py-2 px-2 rounded-xl text-xs font-bengali transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          drawCount === 6
                            ? "bg-white/25 border border-white/60 text-amber-300 font-bold shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                            : "bg-white/10 hover:bg-white/20 border border-white/15 text-neutral-300 hover:text-white"
                        }`}
                      >
                        <span className="font-bold">৬টানে কঠিন নেশা</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PRIMARY ACTION: Light Cigarette Glass Button */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => {
                  if (!currentUserName && onOpenUserModal) {
                    onOpenUserModal();
                  } else {
                    onLight();
                  }
                }}
                className="group relative px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-600/75 via-orange-500/75 to-amber-600/75 hover:from-amber-500/90 hover:via-orange-500/90 hover:to-amber-500/90 backdrop-blur-xl border-t border-white/40 border-x border-amber-400/30 border-b border-amber-900/40 text-white font-bengali text-sm sm:text-base tracking-wide shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_12px_28px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.03] active:scale-95 flex items-center gap-2.5 sm:gap-3 cursor-pointer"
              >
                <Flame size={19} className="text-amber-200 animate-pulse" />
                <span className="font-bold">মাল ধরা</span>
              </button>

              <span className="text-xs font-bengali text-neutral-300">
                <span className="hidden sm:inline">কীবোর্ডের <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold">Space</kbd> বা </span>
                <span>এখানে চাপ দিয়ে ধরা শুরু করুন</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-mono tracking-tight mt-0.5 opacity-80">
                free server, wait 10 seconds if not responding
              </span>
            </div>
          </div>
        )}

        {/* State: LIGHTING — Lighter flame in progress */}
        {state === "lighting" && (
          <div className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-charcoal-900/75 backdrop-blur-2xl border-t border-amber-400/40 border-x border-white/15 border-b border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_12px_28px_rgba(245,158,11,0.3)] flex items-center gap-2.5 sm:gap-3 text-amber-300 font-bengali text-sm tracking-wide animate-pulse">
            <Flame size={16} className="text-orange-400 animate-bounce" />
            <span>সিগারেট ধরানো হচ্ছে...</span>
          </div>
        )}

        {/* State: READY / INHALING / RECOVERING — Active Smoking Controls */}
        {(state === "ready" || state === "inhaling" || state === "recovering") && (
          <div className="flex flex-col items-center gap-2 z-20">
            {/* Inhale Button */}
            <button
              onClick={onInhale}
              disabled={state !== "ready"}
              className={`group relative px-6 sm:px-10 py-3 sm:py-3.5 rounded-full backdrop-blur-2xl transition-all flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base font-bengali tracking-wide shadow-lg ${
                state === "ready"
                  ? "bg-gradient-to-r from-orange-600/75 via-amber-500/75 to-orange-600/75 hover:from-orange-500/90 hover:to-amber-500/90 text-white border-t border-white/40 border-x border-amber-400/30 border-b border-amber-900/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_14px_32px_rgba(245,158,11,0.4)] hover:scale-[1.03] active:scale-95 cursor-pointer"
                  : state === "inhaling"
                  ? "bg-amber-500/40 border border-amber-400/60 text-amber-200 animate-pulse shadow-[inset_0_0_16px_rgba(245,158,11,0.4)] cursor-wait"
                  : "bg-charcoal-900/70 border border-white/10 text-neutral-400 cursor-wait"
              }`}
            >
              <Wind
                size={18}
                className={state === "inhaling" ? "animate-spin text-amber-300" : "text-amber-200"}
              />
              <span className="font-bold">
                {state === "ready" && `টান দিন (${currentDraw + 1}/${totalDraws})`}
                {state === "inhaling" && "টানছেন..."}
                {state === "recovering" && "ধোঁয়া ছাড়ছেন..."}
              </span>
            </button>

            {/* Sub-actions: Pause & Finish Early */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-bengali text-neutral-300">
              <span className="text-neutral-400">
                <span className="hidden sm:inline">Space বা </span>বাটনে টান দিন • স্ক্রিন টেনে চারপাশ দেখুন
              </span>
              <span className="text-neutral-600">•</span>
              <button
                onClick={onPause}
                className="hover:text-amber-400 underline decoration-neutral-600 transition-colors cursor-pointer"
              >
                থামুন
              </button>
              <span className="text-neutral-600">•</span>
              <button
                onClick={onFinishEarly}
                className="hover:text-rose-400 underline decoration-neutral-600 transition-colors cursor-pointer"
              >
                এখানেই শেষ করুন
              </button>
            </div>
          </div>
        )}

        {/* State: PAUSED — Frosted Glass Pause Modal */}
        {state === "paused" && (
          <div className="px-6 py-4 rounded-2xl bg-charcoal-900/85 backdrop-blur-2xl border-t border-white/30 border-x border-white/10 border-b border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col items-center gap-3 animate-in fade-in zoom-in-95">
            <span className="font-bengali text-base font-bold text-white tracking-wide">
              একটু বিরতি
            </span>
            <p className="text-xs font-bengali text-neutral-300 text-center max-w-xs">
              একটু দম নিন। আপনার টান হিসাব সংরক্ষিত আছে ({currentDraw}/{totalDraws})।
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onResume}
                className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bengali font-bold text-xs tracking-wider transition-all active:scale-95 flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Play size={13} />
                <span>আবার টানুন</span>
              </button>
              <button
                onClick={onFinishEarly}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-neutral-200 font-bengali text-xs transition-all active:scale-95 cursor-pointer"
              >
                শেষ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


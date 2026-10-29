"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, CloudRain, Sun, Moon, CloudFog } from "lucide-react";
import { BRANDS } from "@/config/brands.config";
import { ENVIRONMENTS } from "@/config/environments.config";
import { PackIllustration } from "@/components/brand-selection/PackIllustration";
import { StorageManager } from "@/lib/storage/localStorage";
import { audioManager } from "@/features/audio/audioManager";

export default function BrandSelectionPage() {
  const router = useRouter();
  const [selectedBrandId, setSelectedBrandId] = useState<string>("marlboro");
  const [drawCount, setDrawCount] = useState<6 | 7>(7);
  const [selectedEnvId, setSelectedEnvId] = useState<string>("rainy-window");

  // Load saved preferences
  useEffect(() => {
    const prefs = StorageManager.load().preferences;
    if (prefs.lastSelectedBrand) setSelectedBrandId(prefs.lastSelectedBrand);
    if (prefs.preferredDrawCount) setDrawCount(prefs.preferredDrawCount);
    if (prefs.lastSelectedEnvironment) setSelectedEnvId(prefs.lastSelectedEnvironment);
  }, []);

  const handleSelectBrand = (id: string) => {
    audioManager.playBrandClick();
    setSelectedBrandId(id);
    StorageManager.updatePreferences({ lastSelectedBrand: id });
  };

  const handleSelectDrawCount = (count: 6 | 7) => {
    audioManager.playClick();
    setDrawCount(count);
    StorageManager.updatePreferences({ preferredDrawCount: count });
  };

  const handleSelectEnv = (id: string) => {
    audioManager.playClick();
    setSelectedEnvId(id);
    StorageManager.updatePreferences({ lastSelectedEnvironment: id });
  };

  const selectedBrand = BRANDS.find((b) => b.id === selectedBrandId) || BRANDS[2];

  const handleStart = () => {
    router.push(`/session?brand=${selectedBrandId}&draws=${drawCount}&env=${selectedEnvId}`);
  };

  // Keyboard navigation between brands
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = BRANDS.findIndex((b) => b.id === selectedBrandId);
      if (e.key === "ArrowRight") {
        const next = (currentIndex + 1) % BRANDS.length;
        handleSelectBrand(BRANDS[next].id);
      } else if (e.key === "ArrowLeft") {
        const prev = (currentIndex - 1 + BRANDS.length) % BRANDS.length;
        handleSelectBrand(BRANDS[prev].id);
      } else if (e.key === "Enter") {
        handleStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBrandId, drawCount, selectedEnvId]);

  return (
    <div className="min-h-screen bg-charcoal-950 text-neutral-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors text-xs font-bengali font-bold tracking-wider"
        >
          <ArrowLeft size={14} />
          <span>দোকানে ফিরুন</span>
        </Link>

        <div className="text-right">
          <span className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
            Step 1 of 2
          </span>
          <span className="block text-xs font-serif font-bold text-neutral-300">
            Select Your Ritual
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl mx-auto py-6 flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-bengali text-3xl sm:text-5xl font-bold tracking-wide text-white mb-2">
            মাল কোনটা
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Select the familiar aesthetic, tactile draw profile, and atmosphere for your digital pause.
          </p>
        </div>

        {/* Brand Pack Cards Carousel/Grid */}
        <div className="w-full flex items-center justify-center gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 px-4 no-scrollbar">
          {BRANDS.map((brand) => {
            const isSelected = brand.id === selectedBrandId;
            return (
              <button
                key={brand.id}
                onClick={() => handleSelectBrand(brand.id)}
                className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isSelected
                    ? "scale-105 bg-charcoal-900 border-2 border-amber-400 shadow-ember"
                    : "opacity-60 hover:opacity-90 bg-charcoal-950/60 border border-white/5 hover:border-white/10"
                }`}
                aria-pressed={isSelected}
                aria-label={`Select ${brand.name}`}
              >
                <PackIllustration brand={brand} className="w-40 h-60 sm:w-44 sm:h-64" />
                <span className="mt-3 font-serif font-semibold text-sm text-neutral-100">
                  {brand.name}
                </span>
                <span className="text-[10px] text-neutral-400 font-sans">
                  {brand.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Brand Detail Description */}
        <div className="w-full max-w-lg bg-charcoal-900/80 border border-neutral-800 rounded-2xl p-5 mb-8 text-center backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: selectedBrand.accentColor }}
            />
            <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
              {selectedBrand.name} — {selectedBrand.subtitle}
            </h2>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed mb-3">
            {selectedBrand.description}
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-neutral-400">
            <span>Draw profile: <strong className="text-neutral-200 capitalize">{selectedBrand.soundProfile}</strong></span>
            <span>•</span>
            <span>Filter wrap: <strong className="text-neutral-200 capitalize">{selectedBrand.filterTone}</strong></span>
          </div>
        </div>

        {/* Ritual Options: Draw Count & Environment */}
        <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Draw Count Selector */}
          <div className="bg-charcoal-900/60 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-bengali font-bold text-neutral-200">
                  কয় টান মারবেন
                </label>
                <span className="text-xs text-amber-400 font-bengali font-semibold">
                  {drawCount === 7 ? "৭ টান" : "৬ টান"}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-3">
                Choose the length of your digital cigarette pause.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectDrawCount(6)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bengali font-bold transition-all ${
                  drawCount === 6
                    ? "bg-amber-600 text-white border border-amber-400 shadow-sm"
                    : "bg-charcoal-800 text-neutral-400 hover:text-white border border-white/5"
                }`}
              >
                ৬টানে কঠিন নেশা
              </button>
              <button
                type="button"
                onClick={() => handleSelectDrawCount(7)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bengali font-bold transition-all ${
                  drawCount === 7
                    ? "bg-amber-600 text-white border border-amber-400 shadow-sm"
                    : "bg-charcoal-800 text-neutral-400 hover:text-white border border-white/5"
                }`}
              >
                ৭টানে আরামসে খান
              </button>
            </div>
          </div>

          {/* Environment Selector */}
          <div className="bg-charcoal-900/60 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-bengali font-bold text-neutral-200">
                  ঢাকার আবহাওয়া
                </label>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Visual & Audio
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-3">
                Select your immersive background soundscape.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {ENVIRONMENTS.map((env) => {
                const isSelected = env.id === selectedEnvId;
                const envBengaliName =
                  env.id === "day-clear"
                    ? "দিন"
                    : env.id === "clear-evening"
                    ? "রাত"
                    : env.id === "rainy-window"
                    ? "বৃষ্টি"
                    : "কুয়াশা";
                return (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => handleSelectEnv(env.id)}
                    className={`p-2 rounded-xl text-xs font-bengali font-semibold flex flex-col items-center gap-1.5 transition-all text-center ${
                      isSelected
                        ? "bg-amber-600/30 text-amber-200 border border-amber-500/60"
                        : "bg-charcoal-800 text-neutral-400 hover:text-white border border-white/5"
                    }`}
                  >
                    {env.id === "day-clear" ? (
                      <Sun size={16} className="text-amber-400" />
                    ) : env.id === "clear-evening" ? (
                      <Moon size={16} className="text-amber-300" />
                    ) : env.id === "rainy-window" ? (
                      <CloudRain size={16} className="text-sky-400" />
                    ) : (
                      <CloudFog size={16} className="text-neutral-300" />
                    )}
                    <span className="truncate w-full">{envBengaliName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="group flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-bengali font-bold text-base tracking-wide shadow-ember hover:shadow-ember-intense transition-all duration-300 border border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95 cursor-pointer"
        >
          <span>মাল ধরা</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <span className="mt-3 text-[11px] font-mono text-neutral-400">
          Use [Left/Right] arrows to switch brands, [Enter] to begin
        </span>
      </main>

      {/* Footer Disclaimer */}
      <footer className="w-full max-w-5xl mx-auto py-4 text-center border-t border-neutral-900 text-[10px] text-neutral-400">
        Non-commercial digital simulation. Brand names are used solely for user selection; no affiliation or endorsement implied.
      </footer>
    </div>
  );
}

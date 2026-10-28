"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  BarChart3,
  Volume2,
  VolumeX,
  Eye,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Wind,
} from "lucide-react";
import { APP_CONFIG } from "@/config/app.config";
import { BRANDS } from "@/config/brands.config";
import { StorageManager } from "@/lib/storage/localStorage";

export default function LandingPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefs = StorageManager.load().preferences;
    setSoundEnabled(prefs.soundEnabled);
    setReducedMotion(prefs.reducedMotion);
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    StorageManager.updatePreferences({ soundEnabled: next });
  };

  const handleToggleMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    StorageManager.updatePreferences({ reducedMotion: next });
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-neutral-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden select-none">
      {/* Background ambient lighting falloff */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-500/30 shadow-ember">
            <Image
              src="/assets/brand-icon.jpg"
              alt={APP_CONFIG.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-serif text-lg font-bold tracking-widest text-white uppercase">
            {APP_CONFIG.name}
          </span>
        </div>

        {/* Minimal Audio & Accessibility Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
            className="p-2.5 rounded-full bg-charcoal-900/80 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white transition-all text-xs flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden sm:inline font-mono text-[11px]">
              {soundEnabled ? "Audio On" : "Muted"}
            </span>
          </button>

          <button
            onClick={handleToggleMotion}
            aria-label={reducedMotion ? "Enable full motion" : "Reduce motion"}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all text-xs flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              reducedMotion
                ? "bg-amber-600/30 text-amber-300 border-amber-500/50"
                : "bg-charcoal-900/80 border-white/10 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Eye size={16} />
            <span className="hidden sm:inline font-mono text-[11px]">
              {reducedMotion ? "Reduced Motion" : "Motion"}
            </span>
          </button>

          <Link
            href="/progress"
            className="p-2.5 sm:px-4 sm:py-2 rounded-full bg-charcoal-900/80 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white hover:border-amber-500/40 transition-all text-xs font-mono flex items-center gap-2"
          >
            <BarChart3 size={16} className="text-amber-400" />
            <span className="hidden sm:inline">My Progress</span>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center text-center py-12 z-10">
        {/* Emblem Badge */}
        <div className="relative mb-6 group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-ember group-hover:shadow-ember-intense transition-all duration-500">
            <Image
              src="/assets/brand-icon.jpg"
              alt="Vesper Emblem"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-2 inset-x-0 flex justify-center">
            <span className="bg-charcoal-900 border border-amber-500/30 text-[9px] font-mono tracking-widest text-amber-300 uppercase px-2.5 py-0.5 rounded-full shadow-lg">
              Digital Ritual
            </span>
          </div>
        </div>

        {/* Primary Typography */}
        <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 max-w-2xl leading-tight">
          The Ritual You Know.
          <br />
          <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            Without The Smoke.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 max-w-lg mb-8 font-sans leading-relaxed">
          {APP_CONFIG.tagline} {APP_CONFIG.subtext}
        </p>

        {/* Primary Call to Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full max-w-sm justify-center">
          <Link
            href="/select"
            className="w-full sm:w-auto flex-1 py-4 px-8 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-serif font-bold text-sm tracking-widest uppercase shadow-ember hover:shadow-ember-intense transition-all duration-300 border border-amber-400/40 flex items-center justify-center gap-3 active:scale-95"
          >
            <Flame size={18} className="text-amber-200" />
            <span>Start Session</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/progress"
            className="w-full sm:w-auto py-4 px-6 rounded-full bg-charcoal-900/90 hover:bg-charcoal-800 text-neutral-200 font-sans font-medium text-xs tracking-wider uppercase border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <BarChart3 size={15} />
            <span>Track Progress</span>
          </Link>
        </div>

        {/* Brand Preview Pills */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            Selectable Virtual Blends
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {BRANDS.map((b) => (
              <span
                key={b.id}
                className="px-3 py-1 rounded-full bg-charcoal-900/70 border border-white/5 text-neutral-400 text-xs font-serif flex items-center gap-1.5"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: b.accentColor }}
                />
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Transparent Harm Reduction Statement */}
      <footer className="w-full max-w-4xl mx-auto py-4 text-center z-10 border-t border-neutral-900">
        <p className="text-[11px] text-neutral-400 max-w-xl mx-auto leading-relaxed">
          {APP_CONFIG.disclaimer}
        </p>
      </footer>
    </div>
  );
}

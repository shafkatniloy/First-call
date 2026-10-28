"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Flame,
  Plus,
  Minus,
  Sparkles,
  TrendingDown,
  Calendar,
  Download,
  Trash2,
  DollarSign,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { StorageManager, getTodayDateKey } from "@/lib/storage/localStorage";
import { StorageDataV1, DailyLogEntry, UserBaseline } from "@/types/progress";

export default function ProgressPage() {
  const [data, setData] = useState<StorageDataV1 | null>(null);
  const [todayEntry, setTodayEntry] = useState<DailyLogEntry | null>(null);
  const [isEditingBaseline, setIsEditingBaseline] = useState(false);
  const [baselineInput, setBaselineInput] = useState<number>(12);
  const [packPriceInput, setPackPriceInput] = useState<number>(14);

  const reloadData = () => {
    const loaded = StorageManager.load();
    setData(loaded);
    const entry = StorageManager.getOrCreateTodayEntry();
    setTodayEntry(entry);
    setBaselineInput(loaded.baseline.dailyCigarettes);
    setPackPriceInput(loaded.baseline.packPrice || 14);
  };

  useEffect(() => {
    reloadData();
    const handleStorageUpdate = () => reloadData();
    window.addEventListener("vesper-storage-update", handleStorageUpdate);
    return () => window.removeEventListener("vesper-storage-update", handleStorageUpdate);
  }, []);

  if (!data || !todayEntry) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center text-neutral-500 font-mono text-xs">
        Loading progress dashboard...
      </div>
    );
  }

  const baseline = data.baseline.dailyCigarettes;
  const avoidedToday = Math.max(0, baseline - todayEntry.realCigarettes);

  // Calculate last 7 days history
  const historyDays: { dateStr: string; displayLabel: string; real: number; virtual: number; avoided: number }[] = [];
  const todayObj = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayObj);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const log = data.entries[key] || { realCigarettes: 0, virtualSessions: 0 };
    const avoided = Math.max(0, baseline - log.realCigarettes);
    historyDays.push({
      dateStr: key,
      displayLabel: dayName,
      real: log.realCigarettes,
      virtual: log.virtualSessions,
      avoided,
    });
  }

  // All time aggregations
  const allEntries = Object.values(data.entries);
  const totalVirtualAllTime = allEntries.reduce((sum, e) => sum + e.virtualSessions, 0);
  const totalAvoidedAllTime = allEntries.reduce(
    (sum, e) => sum + Math.max(0, baseline - e.realCigarettes),
    0
  );
  const costPerCig = (data.baseline.packPrice || 14) / 20;
  const estimatedSavings = Math.round(totalAvoidedAllTime * costPerCig);

  const handleUpdateReal = (delta: number) => {
    const newCount = Math.max(0, todayEntry.realCigarettes + delta);
    StorageManager.updateRealCigarettes(newCount);
    reloadData();
  };

  const handleSaveBaseline = (e: React.FormEvent) => {
    e.preventDefault();
    StorageManager.updateBaseline({
      dailyCigarettes: Math.max(1, baselineInput),
      packPrice: Math.max(0, packPriceInput),
    });
    setIsEditingBaseline(false);
    reloadData();
  };

  const handleExport = () => {
    const json = StorageManager.exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vesper-progress-${getTodayDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to reset all local tracking data? This cannot be undone.")) {
      StorageManager.clearAll();
      reloadData();
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-neutral-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 mb-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          <span>Back to Landing</span>
        </Link>

        <Link
          href="/select"
          className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs tracking-wider uppercase transition-colors shadow-ember flex items-center gap-2"
        >
          <Flame size={14} />
          <span>New Ritual</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto flex-1 flex flex-col gap-6">
        {/* Title & Privacy Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-wide text-white">
              Smoking Reduction Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Private, self-reported metrics to support gradual consumption reduction.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal-900 border border-white/5 text-[11px] font-mono text-emerald-400 self-start sm:self-auto">
            <ShieldCheck size={14} />
            <span>100% Anonymous Local Data</span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Today's Real Consumption */}
          <div className="bg-charcoal-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider mb-1">
                <span>Real Cigarettes Today</span>
                <span className="text-[10px] text-neutral-400">Baseline: {baseline}</span>
              </div>
              <div className="text-3xl font-mono font-bold text-white mt-1">
                {todayEntry.realCigarettes}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => handleUpdateReal(-1)}
                aria-label="Decrease real cigarette count"
                className="p-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-neutral-300 transition-colors"
              >
                <Minus size={15} />
              </button>
              <button
                onClick={() => handleUpdateReal(1)}
                aria-label="Increase real cigarette count"
                className="flex-1 py-2 px-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus size={15} />
                <span>Log 1 Smoked</span>
              </button>
            </div>
          </div>

          {/* Card 2: Today's Avoided */}
          <div className="bg-charcoal-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-neutral-400 text-xs font-mono uppercase tracking-wider block mb-1">
                Est. Avoided Today
              </span>
              <div className="text-3xl font-mono font-bold text-emerald-400 mt-1 flex items-baseline gap-2">
                <span>{avoidedToday}</span>
                <span className="text-xs text-neutral-400 font-sans">below baseline</span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 mt-4 leading-tight">
              Estimated compared to your self-reported baseline of {baseline} cigs/day.
            </p>
          </div>

          {/* Card 3: Virtual Rituals Completed */}
          <div className="bg-charcoal-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-neutral-400 text-xs font-mono uppercase tracking-wider block mb-1">
                Digital Rituals
              </span>
              <div className="text-3xl font-mono font-bold text-amber-300 mt-1 flex items-baseline gap-2">
                <span>{todayEntry.virtualSessions}</span>
                <span className="text-xs text-neutral-400 font-sans">sessions today</span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 mt-4 leading-tight">
              {todayEntry.drawsCompleted} tactile draws completed without smoke.
            </p>
          </div>

          {/* Card 4: Estimated Savings */}
          <div className="bg-charcoal-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-neutral-400 text-xs font-mono uppercase tracking-wider block mb-1">
                Est. Money Saved
              </span>
              <div className="text-3xl font-mono font-bold text-sky-400 mt-1 flex items-baseline gap-1">
                <span>${estimatedSavings}</span>
                <span className="text-xs text-neutral-400 font-sans">all-time</span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 mt-4 leading-tight">
              Based on ${data.baseline.packPrice || 14}/pack ($0.70 per avoided cigarette).
            </p>
          </div>
        </div>

        {/* 7-Day Visual Comparison Chart */}
        <div className="bg-charcoal-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                7-Day Real vs Digital Consumption
              </h2>
              <p className="text-xs text-neutral-400">
                Visualizing physical cigarettes smoked against digital pauses.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-neutral-600" />
                <span>Real Smoked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500" />
                <span>Digital Ritual</span>
              </div>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="w-full h-48 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-neutral-800">
            {historyDays.map((day, idx) => {
              const maxVal = Math.max(baseline, 20);
              const realHeightPercent = Math.min(100, (day.real / maxVal) * 100);
              const virtualHeightPercent = Math.min(100, (day.virtual / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                    {/* Real bar */}
                    <div
                      className="w-1/2 bg-neutral-600 group-hover:bg-neutral-500 rounded-t transition-all"
                      style={{ height: `${Math.max(4, realHeightPercent)}%` }}
                      title={`Real: ${day.real}`}
                    />
                    {/* Virtual bar */}
                    <div
                      className="w-1/2 bg-amber-500 group-hover:bg-amber-400 rounded-t transition-all shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                      style={{ height: `${Math.max(4, virtualHeightPercent)}%` }}
                      title={`Digital: ${day.virtual}`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 mt-2">
                    {day.displayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Baseline Settings & Data Privacy Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Baseline Configuration Form */}
          <div className="bg-charcoal-900 border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                Personal Baseline Settings
              </h3>
              <button
                onClick={() => setIsEditingBaseline(!isEditingBaseline)}
                className="text-xs font-mono text-amber-400 hover:text-amber-300"
              >
                {isEditingBaseline ? "Cancel" : "Edit Baseline"}
              </button>
            </div>

            {isEditingBaseline ? (
              <form onSubmit={handleSaveBaseline} className="flex flex-col gap-3 mt-3">
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                    Daily Cigarette Baseline
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={baselineInput}
                    onChange={(e) => setBaselineInput(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-charcoal-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                    Pack Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={packPriceInput}
                    onChange={(e) => setPackPriceInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-charcoal-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs uppercase tracking-wider mt-1 transition-colors"
                >
                  Save Baseline
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-2 text-xs text-neutral-300">
                <div className="flex justify-between py-1.5 border-b border-neutral-800">
                  <span className="text-neutral-400">Current Daily Baseline:</span>
                  <strong className="font-mono text-white">{baseline} cigarettes</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-800">
                  <span className="text-neutral-400">Pack Price (20 cigs):</span>
                  <strong className="font-mono text-white">${data.baseline.packPrice || 14}</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-400">Tracking Started:</span>
                  <strong className="font-mono text-white">{data.baseline.startDate}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Privacy & Local Data Management */}
          <div className="bg-charcoal-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-2">
                Data Sovereignty & Privacy
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Your entries remain strictly in your browser&apos;s localStorage. You can export your data as a backup JSON file or permanently erase all logs anytime.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex-1 py-2.5 px-4 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-neutral-200 text-xs font-mono flex items-center justify-center gap-2 transition-colors border border-white/5"
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handleClearAll}
                className="py-2.5 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 size={14} />
                <span>Erase All</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto py-6 text-center text-[11px] text-neutral-400 border-t border-neutral-900 mt-8">
        Vesper Ritual does not provide clinical cessation advice. Self-reported metrics are private estimates for mindful awareness.
      </footer>
    </div>
  );
}

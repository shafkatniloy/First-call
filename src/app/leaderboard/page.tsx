"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  ArrowLeft,
  Flame,
  Search,
  User,
  Crown,
  Medal,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { LeaderboardEntry } from "@/lib/db/database";
import { getBrandById, BRANDS } from "@/config/brands.config";
import { audioManager } from "@/features/audio/audioManager";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [localUserName, setLocalUserName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaderboard = async (userName?: string) => {
    setIsLoading(true);
    try {
      const url = userName
        ? `/api/leaderboard?limit=1000&userName=${encodeURIComponent(userName)}`
        : "/api/leaderboard?limit=1000";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setEntries(data.topUsers || []);
        setCurrentUser(data.currentUser || null);
        setTotalUsers(data.totalUsers || 0);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedName = localStorage.getItem("vesper_user_name") || "";
    setLocalUserName(savedName);
    fetchLeaderboard(savedName);
  }, []);

  const getBrandDetails = (brandId: string) => {
    return getBrandById(brandId);
  };

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase().trim();
    return entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.favoriteBrand.toLowerCase().includes(q) ||
        String(e.rank) === q
    );
  }, [entries, searchQuery]);

  return (
    <div className="min-h-screen bg-charcoal-950 text-neutral-100 flex flex-col items-center select-none pb-20">
      {/* 1. Header Navigation Bar */}
      <header className="w-full max-w-4xl px-4 py-4 sm:py-6 flex items-center justify-between border-b border-white/5 bg-charcoal-900/60 backdrop-blur-xl sticky top-0 z-30">
        <Link
          href="/"
          onClick={() => audioManager.playClick()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-charcoal-800/80 hover:bg-charcoal-700/80 border border-white/10 text-neutral-300 hover:text-white transition-all text-xs font-bengali font-semibold shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} />
          <span>দোকানে ফিরুন</span>
        </Link>

        {/* Center: Brand Seal & Title */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-500/40 shadow-sm shrink-0">
            <Image
              src="/assets/brand-icon.jpg"
              alt="First Call"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-bengali text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>সেরা খোরদের লিডারবোর্ড</span>
              <Trophy size={18} className="text-amber-400 shrink-0" />
            </h1>
            <p className="text-[11px] font-bengali text-neutral-400">
              শীর্ষ ১০০০ জন সর্বোচ্চ সিগারেট টানা মানুষ
            </p>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => {
            audioManager.playClick();
            fetchLeaderboard(localUserName);
          }}
          aria-label="Refresh Leaderboard"
          className="p-2 rounded-full bg-charcoal-800/80 hover:bg-charcoal-700/80 border border-white/10 text-neutral-300 hover:text-white transition-all active:scale-95"
        >
          <RefreshCw size={15} className={isLoading ? "animate-spin text-amber-400" : ""} />
        </button>
      </header>

      {/* 2. Main Content Container */}
      <main className="w-full max-w-4xl px-4 py-6 flex flex-col gap-6">
        {/* Current User Stats Banner */}
        {localUserName && (
          <div className="w-full p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-amber-500/30 shadow-[0_4px_24px_rgba(217,119,6,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
                <Crown size={24} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base sm:text-lg font-bold text-white">
                    @{localUserName}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bengali font-bold border border-amber-500/30">
                    আপনার প্রোফাইল
                  </span>
                </div>
                <p className="font-bengali text-xs text-neutral-400 mt-0.5">
                  টানা শেষ করেছেন:{" "}
                  <strong className="text-amber-400 font-mono">
                    {currentUser ? currentUser.totalBurnt : 0}
                  </strong>{" "}
                  টি সিগারেট
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="px-4 py-2 rounded-2xl bg-charcoal-950/80 border border-white/5 text-center">
                <span className="text-[10px] font-bengali text-neutral-400 block">
                  আপনার পজিশন
                </span>
                <span className="font-mono font-bold text-lg text-amber-300">
                  {currentUser ? `#${currentUser.rank}` : "তালিকার বাইরে"}
                </span>
              </div>

              <Link
                href="/"
                onClick={() => audioManager.playBrandClick()}
                className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bengali font-bold text-xs flex items-center gap-1.5 shadow-ember transition-all active:scale-95"
              >
                <Flame size={14} />
                <span>আরেকটা টানুন</span>
              </Link>
            </div>
          </div>
        )}

        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search size={15} className="absolute left-3.5 top-3 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম বা ব্র্যান্ড দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 bg-charcoal-900 border border-neutral-800 rounded-2xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/60 font-bengali transition-all"
            />
          </div>

          <div className="text-xs font-bengali text-neutral-400 flex items-center gap-2 self-end sm:self-auto">
            <span>মোট খোর তালিকাভুক্ত:</span>
            <span className="font-mono font-bold text-amber-400 bg-charcoal-900 px-2.5 py-1 rounded-xl border border-white/5">
              {totalUsers} জন
            </span>
          </div>
        </div>

        {/* 3. Leaderboard List Table */}
        <div className="w-full bg-charcoal-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-4 sm:px-6 py-3.5 bg-charcoal-950/70 border-b border-white/5 text-[11px] font-bengali font-bold text-neutral-400 uppercase tracking-wider">
            <div className="col-span-2 sm:col-span-1 text-center">র‍্যাংক</div>
            <div className="col-span-6 sm:col-span-5">স্মোকারের নাম</div>
            <div className="col-span-4 sm:col-span-3 text-right">টানা সিগারেট</div>
            <div className="hidden sm:block sm:col-span-3 text-right">প্রিয় মাল</div>
          </div>

          {/* List Items */}
          {isLoading ? (
            <div className="py-16 text-center text-xs text-neutral-500 font-bengali flex flex-col items-center gap-2">
              <RefreshCw size={20} className="animate-spin text-amber-500" />
              <span>লিডারবোর্ড লোড হচ্ছে...</span>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="py-16 text-center text-xs text-neutral-500 font-bengali">
              কোনো স্মোকার খুঁজে পাওয়া যায়নি।
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredEntries.map((user) => {
                const brand = getBrandDetails(user.favoriteBrand);
                const isCurrent = user.isCurrentUser;

                return (
                  <div
                    key={user.name}
                    className={`grid grid-cols-12 px-4 sm:px-6 py-3.5 items-center transition-colors ${
                      isCurrent
                        ? "bg-amber-500/10 hover:bg-amber-500/15"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="col-span-2 sm:col-span-1 flex justify-center">
                      {user.rank === 1 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 font-mono font-bold text-xs shadow-ember">
                          🥇
                        </span>
                      ) : user.rank === 2 ? (
                        <span className="w-7 h-7 rounded-full bg-slate-300/20 border border-slate-300/50 flex items-center justify-center text-slate-200 font-mono font-bold text-xs">
                          🥈
                        </span>
                      ) : user.rank === 3 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-700/20 border border-amber-700/50 flex items-center justify-center text-amber-600 font-mono font-bold text-xs">
                          🥉
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-semibold text-neutral-400">
                          #{user.rank}
                        </span>
                      )}
                    </div>

                    {/* Username */}
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-2 overflow-hidden pr-2">
                      <span className="font-mono text-xs sm:text-sm font-semibold text-white truncate">
                        {user.name}
                      </span>
                      {isCurrent && (
                        <span className="shrink-0 text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bengali font-bold border border-amber-500/40">
                          আপনি
                        </span>
                      )}
                    </div>

                    {/* Total Cigarettes Burnt */}
                    <div className="col-span-4 sm:col-span-3 text-right">
                      <span className="font-mono font-bold text-sm sm:text-base text-amber-300">
                        {user.totalBurnt}
                      </span>
                      <span className="text-[11px] font-bengali text-neutral-400 ml-1">
                        টি
                      </span>
                    </div>

                    {/* Favorite Brand */}
                    <div className="hidden sm:flex sm:col-span-3 justify-end items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: brand.accentColor }}
                      />
                      <span className="text-xs font-serif font-medium text-neutral-300 truncate">
                        {brand.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

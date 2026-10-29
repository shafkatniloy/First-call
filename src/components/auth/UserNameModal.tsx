"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Sparkles, AlertCircle, CheckCircle, ArrowRight, X } from "lucide-react";
import { validateUsername } from "@/lib/validation/username";
import { audioManager } from "@/features/audio/audioManager";

interface UserNameModalProps {
  isOpen: boolean;
  canDismiss?: boolean;
  onSuccess: (name: string) => void;
  onClose?: () => void;
}

export const UserNameModal: React.FC<UserNameModalProps> = ({
  isOpen,
  canDismiss = false,
  onSuccess,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [welcomeInfo, setWelcomeInfo] = useState<{
    name: string;
    totalBurnt: number;
    isReturning: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const val = validateUsername(nameInput);
    if (!val.valid) {
      setErrorMsg(val.error || "সঠিক নাম লিখুন");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "নাম যাচাইয়ে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
        setIsSubmitting(false);
        return;
      }

      audioManager.unlock();
      audioManager.playBrandClick();

      if (data.isReturning) {
        setWelcomeInfo({
          name: data.user.name,
          totalBurnt: data.user.totalBurnt ?? 0,
          isReturning: true,
        });
        setTimeout(() => {
          onSuccess(data.user.name);
        }, 1400);
      } else {
        onSuccess(data.user.name);
      }
    } catch {
      setErrorMsg("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/90 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-charcoal-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
        {canDismiss && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-charcoal-800 border border-white/5 transition-all"
          >
            <X size={16} />
          </button>
        )}

        {/* Vintage Seal Emblem */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-ember mb-4 shrink-0">
          <Image
            src="/assets/brand-icon.jpg"
            alt="First Call Seal"
            fill
            className="object-cover"
          />
        </div>

        {welcomeInfo ? (
          <div className="flex flex-col items-center py-2 animate-fade-in w-full">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-950/50">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-bengali text-2xl font-bold text-white mb-1">
              আবার স্বাগতম!
            </h3>
            <p className="font-mono text-lg text-amber-400 font-bold mb-4">
              @{welcomeInfo.name}
            </p>

            <div className="bg-charcoal-950/90 border border-neutral-800 rounded-2xl p-4 mb-5 w-full text-center">
              <p className="font-bengali text-xs text-neutral-400 mb-1">
                আপনার আগের টানা মোট সিগারেট:
              </p>
              <p className="text-3xl font-extrabold font-mono text-amber-300">
                {welcomeInfo.totalBurnt} <span className="text-sm font-bengali text-neutral-400 font-normal">টি</span>
              </p>
              <p className="text-xs font-bengali text-emerald-400 mt-2 font-medium">
                ✓ পরবর্তী টানা সিগারেটগুলো আপনার এই আইডিতেই যোগ হবে
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bengali text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>দোকানে প্রবেশ করা হচ্ছে...</span>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-bengali text-2xl font-bold text-white mb-2">
              আপনার নাম দিন
            </h2>
            <p className="font-bengali text-xs sm:text-sm text-neutral-400 max-w-xs mb-6 leading-relaxed">
              দোকানে বসার আগে আপনার নাম দিন। পুরোনো নাম দিলে আগের হিসাব বজায় রেখে পরবর্তী সিগারেট যোগ হবে।
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              <div className="w-full text-left">
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-amber-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    autoFocus
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="যেমন: Akash@1, King#Boss, Rony$"
                    className="w-full pl-10 pr-4 py-3 bg-charcoal-950/90 border border-neutral-700 focus:border-amber-500 rounded-2xl text-white font-mono text-sm placeholder:text-neutral-600 focus:outline-none transition-all shadow-inner"
                  />
                </div>

                {/* Error or Rule Message */}
                {errorMsg ? (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bengali mt-2 px-1">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-1.5 text-[11px] text-neutral-500 font-bengali mt-2 px-1 leading-normal">
                    <Sparkles size={12} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>নিয়ম: ইংরেজি অক্ষর, সংখ্যা এবং @, #, $ চিহ্ন (কোনো স্পেস হবে না)।</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !nameInput.trim()}
                className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bengali font-bold text-base shadow-ember transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                <span>{isSubmitting ? "যাচাই করা হচ্ছে..." : "দাখিল করুন ও দোকানে ঢুকুন"}</span>
                <ArrowRight size={16} />
              </button>

              <p className="text-[10px] sm:text-[11px] text-neutral-400 font-mono mt-1 opacity-80 tracking-tight">
                free server, wait 10 seconds if not responding
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};


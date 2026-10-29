"use client";

import React from "react";
import Image from "next/image";
import { BrandConfig } from "@/types/brand";

interface PackIllustrationProps {
  brand: BrandConfig;
  className?: string;
}

export const PackIllustration: React.FC<PackIllustrationProps> = ({ brand, className = "" }) => {
  const { packStyle, filterTone } = brand;

  // Render stylized, luxurious non-infringing vector packaging
  return (
    <div
      className={`relative w-48 h-72 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 border ${packStyle.borderTone} ${className}`}
      style={{
        background: `linear-gradient(145deg, ${packStyle.primaryColor} 0%, ${packStyle.secondaryColor} 100%)`,
      }}
    >
      {/* Subtle paper grain & metallic sheen */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />

      {/* Top Foil Band / Lid Line */}
      <div className="absolute top-16 left-0 right-0 h-[2px] bg-white/20 shadow-sm" />

      {/* Pack Lid Crest / Pattern */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-[10px] tracking-widest uppercase font-mono text-white/50">
        <span>Vesper</span>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: packStyle.accentColor }} />
        <span>20 Class A</span>
      </div>

      {/* Center Motif / Real Pack Image */}
      {brand.image ? (
        <div className="absolute inset-x-2 top-8 bottom-12 flex items-center justify-center p-2 z-10 pointer-events-none">
          <div className="relative w-full h-full">
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
              sizes="192px"
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-x-0 top-24 bottom-14 flex flex-col items-center justify-center px-4">
          {packStyle.pattern === "chevron" && (
          <div className="relative w-full flex flex-col items-center my-auto">
            {/* Geometric stylized roof-chevron */}
            <svg viewBox="0 0 100 60" className="w-28 drop-shadow-md">
              <polygon points="0,0 50,30 100,0 100,60 0,60" fill={packStyle.accentColor} opacity="0.9" />
              <polygon points="10,6 50,30 90,6 90,52 10,52" fill={packStyle.primaryColor} />
            </svg>
            <div className="mt-4 text-center">
              <span className="block font-serif text-2xl font-bold tracking-wider text-white uppercase drop-shadow">
                {brand.name}
              </span>
              <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase font-sans mt-0.5 block">
                Filtered Blend
              </span>
            </div>
          </div>
        )}

        {packStyle.pattern === "stripes" && (
          <div className="relative w-full flex flex-col items-center my-auto">
            {/* Maritime nautical lines */}
            <div className="flex gap-1.5 mb-4 opacity-80">
              <div className="w-1.5 h-12 bg-sky-400 rounded-full" />
              <div className="w-1.5 h-16 bg-white rounded-full" />
              <div className="w-1.5 h-12 bg-sky-400 rounded-full" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-[0.15em] text-white uppercase drop-shadow">
              {brand.name}
            </span>
            <span className="text-[10px] tracking-[0.3em] text-sky-300 uppercase font-mono mt-1">
              Select Reserve
            </span>
          </div>
        )}

        {packStyle.pattern === "crest" && (
          <div className="relative w-full flex flex-col items-center my-auto">
            {/* Elegant European Crest */}
            <div className="w-12 h-12 rounded-full border border-rose-400/50 flex items-center justify-center mb-3">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300 font-serif text-sm font-bold">
                M
              </div>
            </div>
            <span className="font-serif text-2xl font-semibold tracking-wider text-stone-100 uppercase">
              {brand.name}
            </span>
            <span className="text-[9px] tracking-[0.25em] text-stone-400 uppercase font-sans mt-1">
              Fine Tobacco
            </span>
          </div>
        )}

        {packStyle.pattern === "botanical" && (
          <div className="relative w-full flex flex-col items-center my-auto">
            {/* Gilded leaf crest */}
            <svg viewBox="0 0 100 80" className="w-16 h-12 text-amber-400 mb-2 fill-current opacity-90 drop-shadow">
              <path d="M50 0 C65 20, 85 30, 85 55 C85 70, 70 80, 50 80 C30 80, 15 70, 15 55 C15 30, 35 20, 50 0 Z" opacity="0.25" />
              <path d="M50 10 Q65 40 50 70 M50 30 Q60 40 50 50 M50 20 Q40 35 50 45" stroke="#eab308" strokeWidth="2.5" fill="none" />
            </svg>
            <span className="font-serif text-xl font-bold tracking-widest text-amber-200 uppercase drop-shadow">
              {brand.name}
            </span>
            <span className="text-[9px] tracking-[0.25em] text-amber-400/80 uppercase font-mono mt-1">
              Virginia Cut
            </span>
          </div>
        )}

        {packStyle.pattern === "minimal" && (
          <div className="relative w-full flex flex-col items-center my-auto">
            <div className="w-10 h-10 rounded-full border border-amber-400/30 flex items-center justify-center mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <span className="font-serif text-xl font-medium tracking-widest text-neutral-200 uppercase">
              {brand.name}
            </span>
            <span className="text-[9px] tracking-[0.25em] text-amber-400/70 uppercase font-mono mt-1">
              Harm Reduction Edition
            </span>
          </div>
        )}
      </div>
      )}

      {/* Bottom Filter Preview Bar */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-black/40 backdrop-blur-sm border-t border-white/10 flex items-center justify-between px-3 text-[10px] text-neutral-300">
        <span className="capitalize text-neutral-400">{brand.soundProfile} draw</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] uppercase tracking-wider text-neutral-500">Filter</span>
          <div
            className={`w-4 h-2 rounded-sm border ${
              filterTone === "cork"
                ? "bg-amber-700/80 border-amber-600"
                : filterTone === "white"
                ? "bg-slate-200 border-slate-300"
                : filterTone === "gold-band"
                ? "bg-amber-900 border-amber-400"
                : "bg-neutral-800 border-neutral-600"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

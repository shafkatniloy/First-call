"use client";

import React from "react";
import { SessionState } from "@/types/session";

interface EmberGlowProps {
  state: SessionState;
  emberColor?: string;
  drawNumber?: number;
  totalDraws?: number;
}

export const EmberGlow: React.FC<EmberGlowProps> = ({
  state,
  emberColor = "#ff4d00",
  drawNumber = 0,
  totalDraws = 7,
}) => {
  const isLit = state !== "idle";
  const isInhaling = state === "inhaling";
  const isLighting = state === "lighting";

  if (!isLit) {
    // Unlit, cold tobacco tip
    return (
      <div className="absolute top-[37%] left-[27%] w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-amber-950/90 to-stone-800/80 border border-stone-700/40 opacity-80" />
      </div>
    );
  }

  return (
    <div className="absolute top-[37.2%] left-[27.3%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
      {/* Lighting ignition flame effect */}
      {isLighting && (
        <div className="absolute -top-12 -left-3 w-10 h-16 pointer-events-none animate-pulse">
          <div className="w-full h-full rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-transparent blur-sm opacity-90 scale-125" />
          <div className="absolute inset-x-2 bottom-1 h-8 rounded-full bg-white blur-[1px] opacity-80" />
        </div>
      )}

      {/* Dynamic ambient bloom lighting the surrounding scene and hand */}
      <div
        className={`absolute rounded-full transition-all duration-700 -translate-x-1/2 -translate-y-1/2 ${
          isInhaling
            ? "w-48 h-48 bg-orange-600/35 blur-3xl scale-125"
            : "w-28 h-28 bg-orange-700/20 blur-2xl scale-100"
        }`}
        style={{
          backgroundColor: isInhaling ? "#ff5500" : emberColor,
          opacity: isInhaling ? 0.45 : 0.22,
        }}
      />

      {/* Ember Core Flare */}
      <div
        className={`relative rounded-full transition-all duration-300 flex items-center justify-center ${
          isInhaling
            ? "w-9 h-9 scale-125 shadow-ember-intense"
            : "w-7 h-7 scale-100 shadow-ember animate-ember-pulse"
        }`}
        style={{
          background: isInhaling
            ? "radial-gradient(circle, #ffffff 10%, #fff2a8 30%, #ff4800 70%, #851e00 100%)"
            : `radial-gradient(circle, #ffeedd 15%, #ff7700 45%, ${emberColor} 75%, #3d1406 100%)`,
        }}
      >
        {/* Ash flecks & texture */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_top,transparent_60%,rgba(60,60,60,0.6)_100%)]" />

        {/* Hot white central heat point */}
        <div
          className={`rounded-full transition-all duration-200 ${
            isInhaling ? "w-4 h-4 bg-white blur-[1px]" : "w-2 h-2 bg-amber-100/80 blur-[0.5px]"
          }`}
        />
      </div>
    </div>
  );
};

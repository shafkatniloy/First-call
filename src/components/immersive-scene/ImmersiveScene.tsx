"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SessionState } from "@/types/session";
import { BrandConfig } from "@/types/brand";
import { EnvironmentConfig } from "@/types/environment";
import { SmokeCanvas } from "./SmokeCanvas";
import { EmberGlow } from "./EmberGlow";

interface ImmersiveSceneProps {
  state: SessionState;
  brand: BrandConfig;
  environment: EnvironmentConfig;
  currentDraw: number;
  totalDraws: number;
  reducedMotion?: boolean;
}

export const ImmersiveScene: React.FC<ImmersiveSceneProps> = ({
  state,
  brand,
  environment,
  currentDraw,
  totalDraws,
  reducedMotion = false,
}) => {
  const isLit = state !== "idle";
  const isInhaling = state === "inhaling";
  const isRecovering = state === "recovering";

  // Determine hand motion animation state
  const getHandTransform = () => {
    if (reducedMotion) {
      return { y: 0, x: 0, scale: 1 };
    }
    if (isInhaling) {
      // Hand lifts closer to the mouth / center of camera
      return { y: -38, x: -18, scale: 1.08, rotate: -1.5 };
    }
    if (isRecovering) {
      // Slowly drifting back down
      return { y: -8, x: -4, scale: 1.02, rotate: -0.5 };
    }
    return { y: 0, x: 0, scale: 1, rotate: 0 };
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-charcoal-950 select-none">
      {/* 1. Atmospheric Background Layer with subtle slow motion */}
      <motion.div
        className="absolute inset-0 w-full h-full scale-105"
        animate={
          reducedMotion
            ? {}
            : {
                scale: isInhaling ? 1.08 : [1.05, 1.06, 1.05],
                y: isInhaling ? -10 : [0, -6, 0],
              }
        }
        transition={{
          duration: isInhaling ? 2.2 : 12,
          repeat: isInhaling ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src={`/assets/backgrounds/${environment.id}.jpg`}
          alt={environment.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.72] contrast-[1.12]"
        />

        {/* Dynamic environmental lighting tint influenced by ember glow */}
        <div
          className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 60% 70%, ${brand.emberColor}33 0%, transparent 65%)`,
            opacity: isInhaling ? 0.6 : isLit ? 0.25 : 0.05,
          }}
        />

        {/* Rain streaks overlay / Fog gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
      </motion.div>

      {/* 2. First-Person Hand & Cigarette Composition */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <motion.div
          className="relative w-full max-w-2xl aspect-[4/3] origin-bottom-right transition-transform"
          animate={getHandTransform()}
          transition={{
            duration: isInhaling ? 2.2 : isRecovering ? 1.6 : 1.2,
            ease: [0.25, 0.1, 0.25, 1.0],
          }}
          style={{
            transformOrigin: "bottom right",
          }}
        >
          {/* Hand Foreground Image (Lit vs Unlit) with screen blend for deep charcoal backgrounds */}
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              {!isLit ? (
                <motion.div
                  key="unlit-hand"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/assets/foreground/hand-unlit.jpg"
                    alt="Hand holding unlit cigarette"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-contain object-bottom mix-blend-screen drop-shadow-cinematic"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="lit-hand"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/assets/foreground/hand-lit.jpg"
                    alt="Hand holding lit cigarette with glowing ember"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-contain object-bottom mix-blend-screen drop-shadow-cinematic"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ember Glow Overlay */}
            <EmberGlow
              state={state}
              emberColor={brand.emberColor}
              drawNumber={currentDraw}
              totalDraws={totalDraws}
            />

            {/* Particle Smoke Dynamics Canvas anchored to ember coordinates */}
            <SmokeCanvas
              state={state}
              emberPosition={{ xPercent: 27.3, yPercent: 37.2 }}
              reducedMotion={reducedMotion}
            />
          </div>
        </motion.div>
      </div>

      {/* 3. Screen Edge Depth & Atmospheric Haze */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(8,9,10,0.85)_100%)]" />
    </div>
  );
};

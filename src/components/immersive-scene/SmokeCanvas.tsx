"use client";

import React, { useEffect, useRef } from "react";
import { SessionState } from "@/types/session";

interface SmokeCanvasProps {
  state: SessionState;
  emberPosition: { xPercent: number; yPercent: number };
  reducedMotion?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  alpha: number;
  decay: number;
  swayFreq: number;
  swayAmp: number;
  age: number;
}

export const SmokeCanvas: React.FC<SmokeCanvasProps> = ({
  state,
  emberPosition,
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const spawnParticle = (intensity: "idle" | "exhale" | "ember") => {
      const originX = (emberPosition.xPercent / 100) * width;
      const originY = (emberPosition.yPercent / 100) * height;

      if (intensity === "exhale") {
        // Larger exhaled puff
        particlesRef.current.push({
          x: originX + (Math.random() - 0.5) * 30,
          y: originY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 1.5 - 0.8,
          vy: -Math.random() * 2.5 - 1.2,
          size: 14 + Math.random() * 12,
          maxSize: 60 + Math.random() * 40,
          alpha: 0.45 + Math.random() * 0.2,
          decay: 0.004 + Math.random() * 0.004,
          swayFreq: 0.02 + Math.random() * 0.02,
          swayAmp: 0.8 + Math.random() * 0.8,
          age: 0,
        });
      } else {
        // Subtle curling wisp from ember
        particlesRef.current.push({
          x: originX + (Math.random() - 0.5) * 6,
          y: originY,
          vx: (Math.random() - 0.5) * 0.6 - 0.4,
          vy: -Math.random() * 1.8 - 0.8,
          size: 4 + Math.random() * 4,
          maxSize: 28 + Math.random() * 15,
          alpha: 0.35 + Math.random() * 0.2,
          decay: 0.006 + Math.random() * 0.004,
          swayFreq: 0.03 + Math.random() * 0.03,
          swayAmp: 0.6,
          age: 0,
        });
      }
    };

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Spawn rules based on state
      if (state === "ready" || state === "lighting") {
        if (tick % 4 === 0 && particlesRef.current.length < 80) {
          spawnParticle("idle");
        }
      } else if (state === "recovering") {
        if (tick % 2 === 0 && particlesRef.current.length < 120) {
          spawnParticle("exhale");
        }
      } else if (state === "inhaling") {
        // Less ambient smoke during draw, ember draws in
        if (tick % 10 === 0 && particlesRef.current.length < 30) {
          spawnParticle("ember");
        }
      }

      // Update and draw particles
      const alive: Particle[] = [];
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.age++;
        p.x += p.vx + Math.sin(p.age * p.swayFreq) * p.swayAmp;
        p.y += p.vy;
        p.size = Math.min(p.maxSize, p.size + 0.35);
        p.alpha -= p.decay;

        if (p.alpha > 0.01 && p.y > -50 && p.x > -50 && p.x < width + 50) {
          alive.push(p);

          const gradient = ctx.createRadialGradient(p.x, p.y, p.size * 0.1, p.x, p.y, p.size);
          // Atmospheric smoke tone with soft warm tint near ember
          gradient.addColorStop(0, `rgba(220, 222, 228, ${p.alpha * 0.7})`);
          gradient.addColorStop(0.5, `rgba(180, 185, 195, ${p.alpha * 0.35})`);
          gradient.addColorStop(1, "rgba(100, 105, 115, 0)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      particlesRef.current = alive;

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [state, emberPosition, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20 w-full h-full"
    />
  );
};

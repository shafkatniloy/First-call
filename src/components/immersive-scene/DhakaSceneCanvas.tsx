"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SessionState } from "@/types/session";
import { BrandConfig } from "@/types/brand";
import { SceneWorld } from "./SceneWorld";
import { CameraController } from "./CameraController";
import { FirstPersonHand3D } from "./FirstPersonHand3D";
import { SmokeParticles3D } from "./SmokeParticles3D";
import { DHAKA_SCENE_CONFIG } from "@/config/dhakaScene.config";

interface DhakaSceneCanvasProps {
  state: SessionState;
  brand: BrandConfig;
  currentDraw: number;
  totalDraws: number;
  reducedMotion?: boolean;
}

export const DhakaSceneCanvas: React.FC<DhakaSceneCanvasProps> = ({
  state,
  brand,
  currentDraw,
  totalDraws,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handRef = useRef<FirstPersonHand3D | null>(null);
  const stateRef = useRef<SessionState>(state);
  const currentDrawRef = useRef<number>(currentDraw);
  const totalDrawsRef = useRef<number>(totalDraws);

  // Mouse cursor hidden state
  const [isPointerHidden, setIsPointerHidden] = useState<boolean>(false);

  // Keep refs in sync with props for the animation loop
  useEffect(() => {
    stateRef.current = state;
    currentDrawRef.current = currentDraw;
    totalDrawsRef.current = totalDraws;

    // Automatically hide cursor when entering active smoking states
    if (state === "lighting" || state === "ready" || state === "inhaling") {
      setIsPointerHidden(true);
    } else if (state === "completed" || state === "paused") {
      setIsPointerHidden(false);
    }
  }, [state, currentDraw, totalDraws]);

  // Handle Ctrl key to show mouse pointer again
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsPointerHidden(false);
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCanvasClick = () => {
    // Re-hide pointer on canvas click during active session
    if (stateRef.current !== "completed" && stateRef.current !== "paused") {
      setIsPointerHidden(true);
      if (containerRef.current && !document.pointerLockElement) {
        try {
          containerRef.current.requestPointerLock();
        } catch (e) {
          // Fallback to CSS cursor: none
        }
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Renderer Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.appendChild(renderer.domElement);

    // 2. Camera Setup
    const { camera: camCfg } = DHAKA_SCENE_CONFIG;
    const camera = new THREE.PerspectiveCamera(
      camCfg.fov,
      width / height,
      camCfg.near,
      camCfg.far
    );

    // 3. World Scene Setup
    const world = new SceneWorld();
    const scene = world.scene;

    // 4. Attach First-Person Hand to Camera
    const hand = new FirstPersonHand3D(brand.emberColor);
    handRef.current = hand;
    camera.add(hand.group);
    scene.add(camera);

    // 5. Weather & Smoke Particles System
    const weatherAndSmoke = new SmokeParticles3D(DHAKA_SCENE_CONFIG.weather.rainEnabled);
    scene.add(weatherAndSmoke.group);

    // 6. Camera Controller (Pan / Look-around)
    const cameraController = new CameraController(camera, renderer.domElement);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation Render Loop
    let lastTime = performance.now();
    let animId: number;

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update camera look-around & breath sway
      if (!reducedMotion) {
        cameraController.update(delta);
      }

      // Update 3D FPS Hand, Ember Flare, Burn-Down & Second Lighter Hand
      hand.update(
        stateRef.current,
        currentDrawRef.current,
        totalDrawsRef.current,
        delta
      );

      // Update Smoke Particles based on Ember Tip Position & Camera orientation
      const emberWorldPos = hand.getEmberWorldPosition();
      weatherAndSmoke.update(stateRef.current, emberWorldPos, camera, delta);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [brand.emberColor, reducedMotion]);

  return (
    <div
      ref={containerRef}
      onClick={handleCanvasClick}
      className={`absolute inset-0 w-full h-full overflow-hidden bg-charcoal-950 select-none ${
        isPointerHidden ? "cursor-none" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      {/* Cinematic CRT grain & subtle corner vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-50 z-10" />

      {/* Pointer control hint pill */}
      {isPointerHidden ? (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none z-20 px-3.5 py-1 rounded-full bg-charcoal-900/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-amber-300 shadow-lg animate-pulse">
          Pointer hidden • Press <kbd className="px-1.5 py-0.5 rounded bg-charcoal-800 border border-white/20 text-white font-bold">Ctrl</kbd> to show cursor
        </div>
      ) : (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none z-20 px-3 py-1 rounded-full bg-charcoal-900/60 backdrop-blur-sm border border-white/5 text-[10px] font-mono text-neutral-400 opacity-70">
          Click scene to lock mouse • Drag to look around
        </div>
      )}
    </div>
  );
};

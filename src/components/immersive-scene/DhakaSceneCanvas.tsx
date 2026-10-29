"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SessionState } from "@/types/session";
import { BrandConfig } from "@/types/brand";
import { EnvironmentConfig } from "@/types/environment";
import { SceneWorld } from "./SceneWorld";
import { CameraController } from "./CameraController";
import { FirstPersonHand3D } from "./FirstPersonHand3D";
import { SmokeParticles3D } from "./SmokeParticles3D";
import { DHAKA_SCENE_CONFIG } from "@/config/dhakaScene.config";

interface DhakaSceneCanvasProps {
  state: SessionState;
  brand: BrandConfig;
  environment?: EnvironmentConfig;
  currentDraw: number;
  totalDraws: number;
  reducedMotion?: boolean;
}

export const DhakaSceneCanvas: React.FC<DhakaSceneCanvasProps> = ({
  state,
  brand,
  environment,
  currentDraw,
  totalDraws,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<SceneWorld | null>(null);
  const handRef = useRef<FirstPersonHand3D | null>(null);
  const weatherAndSmokeRef = useRef<SmokeParticles3D | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const stateRef = useRef<SessionState>(state);
  const currentDrawRef = useRef<number>(currentDraw);
  const totalDrawsRef = useRef<number>(totalDraws);

  // Keep refs in sync with props for the animation loop
  useEffect(() => {
    stateRef.current = state;
    currentDrawRef.current = currentDraw;
    totalDrawsRef.current = totalDraws;
  }, [state, currentDraw, totalDraws]);

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

    // 2. Camera Setup (with Adaptive Mobile Portrait FOV)
    const { camera: camCfg } = DHAKA_SCENE_CONFIG;
    const computeAdaptiveFov = (w: number, h: number) => {
      if (w < h) {
        // Expand vertical FOV on narrow portrait screens to maintain wide street visibility
        const aspect = w / h;
        return Math.min(78, camCfg.fov + (0.75 - Math.min(0.75, aspect)) * 36);
      }
      return camCfg.fov;
    };

    const camera = new THREE.PerspectiveCamera(
      computeAdaptiveFov(width, height),
      width / height,
      camCfg.near,
      camCfg.far
    );

    // 3. World Scene Setup
    const world = new SceneWorld();
    worldRef.current = world;
    const scene = world.scene;
    sceneRef.current = scene;

    // Apply initial environment
    if (environment) {
      world.setEnvironment(environment.id);
    }

    // 4. Attach First-Person Hand to Camera
    const hand = new FirstPersonHand3D(brand);
    handRef.current = hand;
    camera.add(hand.group);
    scene.add(camera);

    // 5. Weather & Smoke Particles System
    const weatherAndSmoke = new SmokeParticles3D(DHAKA_SCENE_CONFIG.weather.rainEnabled);
    weatherAndSmokeRef.current = weatherAndSmoke;
    if (environment) {
      weatherAndSmoke.setRainVisible(environment.id === "rainy-window");
    }
    scene.add(weatherAndSmoke.group);

    // 6. Camera Controller (Pan / Look-around)
    const cameraController = new CameraController(camera, renderer.domElement);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.fov = computeAdaptiveFov(w, h);
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

      // Update Smoke Particles based on Ember Tip / Mouth Position & Camera orientation
      const emberWorldPos = hand.getEmberWorldPosition();
      const mouthWorldPos = hand.getMouthWorldPosition();
      const smokeOrigin = stateRef.current === "recovering" ? mouthWorldPos : emberWorldPos;
      weatherAndSmoke.update(stateRef.current, smokeOrigin, camera, delta);

      // Update Animated Street NPCs (Tea Maker & Street Brawl)
      world.update(delta, time / 1000);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [reducedMotion]);

  // Dynamically update brand styling without reloading WebGL
  useEffect(() => {
    if (handRef.current) {
      handRef.current.updateBrand(brand);
    }
  }, [brand.id, brand.emberColor, brand.filterTone, brand.accentColor]);

  // Dynamically update weather effects (Day/Night, sky, sunlight, streetlights & rain) without reloading WebGL
  useEffect(() => {
    if (!environment) return;
    if (worldRef.current) {
      worldRef.current.setEnvironment(environment.id);
    }
    if (weatherAndSmokeRef.current) {
      weatherAndSmokeRef.current.setRainVisible(environment.id === "rainy-window");
    }
  }, [environment?.id]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-charcoal-950 select-none cursor-default touch-none"
    >
      {/* Cinematic CRT grain & subtle corner vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-50 z-10" />
    </div>
  );
};

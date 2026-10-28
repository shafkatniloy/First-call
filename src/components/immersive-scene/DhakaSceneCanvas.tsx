"use client";

import React, { useEffect, useRef } from "react";
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

  // Keep stateRef in sync with prop for the animation loop
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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

      // Update 3D FPS Hand & Ember Flare
      hand.update(stateRef.current, delta);

      // Update Smoke Particles based on Ember Tip Position
      const emberWorldPos = hand.getEmberWorldPosition();
      weatherAndSmoke.update(stateRef.current, emberWorldPos, delta);

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
  }, [brand.emberColor, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-charcoal-950 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Cinematic CRT grain & subtle corner vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-50 z-10" />

      {/* Look-around hint pill for first-time orientation */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none z-20 px-3 py-1 rounded-full bg-charcoal-900/60 backdrop-blur-sm border border-white/5 text-[10px] font-mono text-neutral-400 opacity-70">
        Drag or move to look around the street
      </div>
    </div>
  );
};

import * as THREE from "three";
import { SessionState } from "@/types/session";

interface SmokeParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  size: number;
  maxSize: number;
  alpha: number;
  decay: number;
  age: number;
}

export class SmokeParticles3D {
  public group: THREE.Group;
  private smokePoints: THREE.Points;
  private smokeGeo: THREE.BufferGeometry;
  private smokePositions: Float32Array;
  private smokeSizes: Float32Array;
  private smokeAlphas: Float32Array;
  private particles: SmokeParticleData[] = [];
  private maxSmokeParticles = 120;

  // Rain system
  private rainLines: THREE.LineSegments | null = null;
  private rainPositions: Float32Array | null = null;
  private rainSpeed: number = 16;
  private rainCount: number = 650;

  constructor(rainEnabled: boolean = true) {
    this.group = new THREE.Group();
    this.group.name = "WeatherAndSmoke";

    // 1. Build Smoke Points System
    this.smokePositions = new Float32Array(this.maxSmokeParticles * 3);
    this.smokeSizes = new Float32Array(this.maxSmokeParticles);
    this.smokeAlphas = new Float32Array(this.maxSmokeParticles);

    this.smokeGeo = new THREE.BufferGeometry();
    this.smokeGeo.setAttribute("position", new THREE.BufferAttribute(this.smokePositions, 3));
    this.smokeGeo.setAttribute("size", new THREE.BufferAttribute(this.smokeSizes, 1));
    this.smokeGeo.setAttribute("alpha", new THREE.BufferAttribute(this.smokeAlphas, 1));

    // Create soft radial circular smoke texture
    const smokeCanvas = document.createElement("canvas");
    smokeCanvas.width = 64;
    smokeCanvas.height = 64;
    const ctx = smokeCanvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
      grad.addColorStop(0, "rgba(220, 225, 235, 0.9)");
      grad.addColorStop(0.4, "rgba(180, 185, 195, 0.4)");
      grad.addColorStop(1, "rgba(100, 105, 115, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const smokeTexture = new THREE.CanvasTexture(smokeCanvas);

    const smokeMaterial = new THREE.PointsMaterial({
      size: 0.12,
      map: smokeTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexColors: false,
      color: 0xd8dde6,
    });

    this.smokePoints = new THREE.Points(this.smokeGeo, smokeMaterial);
    this.group.add(this.smokePoints);

    // 2. Build Rain System
    if (rainEnabled) {
      this.initRain();
    }
  }

  private initRain(): void {
    const positions = new Float32Array(this.rainCount * 2 * 3);
    for (let i = 0; i < this.rainCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = Math.random() * 14 + 1;
      const z = (Math.random() - 0.5) * 30 - 5;
      const dropLen = 0.35 + Math.random() * 0.2;

      // Top of streak
      positions[i * 6 + 0] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      // Bottom of streak
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y - dropLen;
      positions[i * 6 + 5] = z;
    }

    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const rainMat = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.28,
    });

    this.rainLines = new THREE.LineSegments(rainGeo, rainMat);
    this.rainPositions = positions;
    this.group.add(this.rainLines);
  }

  public spawnSmoke(emberPos: THREE.Vector3, type: "idle" | "exhale"): void {
    if (this.particles.length >= this.maxSmokeParticles) return;

    if (type === "exhale") {
      // Larger billowing puff
      this.particles.push({
        position: emberPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.04, 0, (Math.random() - 0.5) * 0.04)),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.12 - 0.04,
          Math.random() * 0.28 + 0.18,
          (Math.random() - 0.5) * 0.12 - 0.06
        ),
        size: 0.06,
        maxSize: 0.35,
        alpha: 0.6,
        decay: 0.008,
        age: 0,
      });
    } else {
      // Gentle curling wisp
      this.particles.push({
        position: emberPos.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.03 - 0.01,
          Math.random() * 0.14 + 0.08,
          (Math.random() - 0.5) * 0.03
        ),
        size: 0.025,
        maxSize: 0.14,
        alpha: 0.45,
        decay: 0.01,
        age: 0,
      });
    }
  }

  public update(state: SessionState, emberPos: THREE.Vector3, delta: number): void {
    // 1. Spawn smoke based on state
    if (state === "ready" || state === "lighting") {
      if (Math.random() < 0.45) {
        this.spawnSmoke(emberPos, "idle");
      }
    } else if (state === "recovering") {
      this.spawnSmoke(emberPos, "exhale");
    }

    // 2. Update existing smoke particles
    const alive: SmokeParticleData[] = [];
    let pIdx = 0;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.age += delta;
      p.position.addScaledVector(p.velocity, delta);
      // Gentle horizontal sway turbulence
      p.position.x += Math.sin(p.age * 3.5) * 0.001;
      p.size = Math.min(p.maxSize, p.size + delta * 0.12);
      p.alpha -= p.decay;

      if (p.alpha > 0.01) {
        alive.push(p);

        this.smokePositions[pIdx * 3 + 0] = p.position.x;
        this.smokePositions[pIdx * 3 + 1] = p.position.y;
        this.smokePositions[pIdx * 3 + 2] = p.position.z;
        this.smokeSizes[pIdx] = p.size;
        this.smokeAlphas[pIdx] = p.alpha;
        pIdx++;
      }
    }

    // Zero out unused slots
    for (let i = pIdx; i < this.maxSmokeParticles; i++) {
      this.smokePositions[i * 3 + 0] = 0;
      this.smokePositions[i * 3 + 1] = -100;
      this.smokePositions[i * 3 + 2] = 0;
      this.smokeSizes[i] = 0;
      this.smokeAlphas[i] = 0;
    }

    this.particles = alive;
    this.smokeGeo.attributes.position.needsUpdate = true;
    this.smokeGeo.attributes.size.needsUpdate = true;
    this.smokeGeo.attributes.alpha.needsUpdate = true;

    // 3. Update rain drops
    if (this.rainLines && this.rainPositions) {
      const dropFall = this.rainSpeed * delta;
      for (let i = 0; i < this.rainCount; i++) {
        this.rainPositions[i * 6 + 1] -= dropFall;
        this.rainPositions[i * 6 + 4] -= dropFall;

        if (this.rainPositions[i * 6 + 4] < 0) {
          const resetY = 12 + Math.random() * 4;
          const dropLen = 0.35 + Math.random() * 0.2;
          this.rainPositions[i * 6 + 1] = resetY;
          this.rainPositions[i * 6 + 4] = resetY - dropLen;
        }
      }
      this.rainLines.geometry.attributes.position.needsUpdate = true;
    }
  }
}

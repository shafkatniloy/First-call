import * as THREE from "three";
import { SessionState } from "@/types/session";

interface SmokeBillboard {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  size: number;
  maxSize: number;
  alpha: number;
  decay: number;
  rotationSpeed: number;
  age: number;
  active: boolean;
}

export class SmokeParticles3D {
  public group: THREE.Group;
  private smokeBillboards: SmokeBillboard[] = [];
  private maxBillboards = 60;
  private smokeMaterial: THREE.MeshBasicMaterial;

  // Rain system
  private rainLines: THREE.LineSegments | null = null;
  private rainPositions: Float32Array | null = null;
  private rainSpeed: number = 16;
  private rainCount: number = 650;

  constructor(rainEnabled: boolean = true) {
    this.group = new THREE.Group();
    this.group.name = "WeatherAndSmoke";

    // Create high-contrast procedural smoke puff texture
    const smokeTexture = this.createSmokeTexture();

    this.smokeMaterial = new THREE.MeshBasicMaterial({
      map: smokeTexture,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
    });

    // Pool of reusable billboard meshes
    const planeGeo = new THREE.PlaneGeometry(1, 1);
    for (let i = 0; i < this.maxBillboards; i++) {
      const mesh = new THREE.Mesh(planeGeo, this.smokeMaterial.clone());
      mesh.visible = false;
      this.group.add(mesh);

      this.smokeBillboards.push({
        mesh,
        velocity: new THREE.Vector3(),
        size: 0.04,
        maxSize: 0.25,
        alpha: 0,
        decay: 0.01,
        rotationSpeed: 0,
        age: 0,
        active: false,
      });
    }

    // 2. Build Rain System
    if (rainEnabled) {
      this.initRain();
    }
  }

  private createSmokeTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 128, 128);
      // Soft organic multi-ring smoke puff
      const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
      grad.addColorStop(0, "rgba(240, 242, 248, 0.85)");
      grad.addColorStop(0.3, "rgba(210, 215, 225, 0.6)");
      grad.addColorStop(0.65, "rgba(160, 168, 180, 0.25)");
      grad.addColorStop(1, "rgba(100, 105, 115, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(64, 64, 60, 0, Math.PI * 2);
      ctx.fill();

      // Additional soft cloud bumps for texture
      for (let i = 0; i < 5; i++) {
        const ox = 64 + (Math.random() - 0.5) * 28;
        const oy = 64 + (Math.random() - 0.5) * 28;
        const subGrad = ctx.createRadialGradient(ox, oy, 2, ox, oy, 35);
        subGrad.addColorStop(0, "rgba(220, 225, 235, 0.35)");
        subGrad.addColorStop(1, "rgba(120, 125, 135, 0)");
        ctx.fillStyle = subGrad;
        ctx.beginPath();
        ctx.arc(ox, oy, 35, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  private initRain(): void {
    const positions = new Float32Array(this.rainCount * 2 * 3);
    for (let i = 0; i < this.rainCount; i++) {
      const x = (Math.random() - 0.5) * 22;
      const y = Math.random() * 14 + 1;
      const z = (Math.random() - 0.5) * 32 - 5;
      const dropLen = 0.38 + Math.random() * 0.22;

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
      opacity: 0.32,
    });

    this.rainLines = new THREE.LineSegments(rainGeo, rainMat);
    this.rainPositions = positions;
    this.group.add(this.rainLines);
  }

  public spawnSmoke(origin: THREE.Vector3, type: "wisp" | "exhale" | "ignite"): void {
    const p = this.smokeBillboards.find((b) => !b.active);
    if (!p) return;

    p.active = true;
    p.age = 0;
    p.mesh.visible = true;
    p.rotationSpeed = (Math.random() - 0.5) * 1.5;

    if (type === "exhale") {
      // Large billowing exhale cloud
      p.mesh.position.copy(origin).add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.06 - 0.05
        )
      );
      p.velocity.set(
        (Math.random() - 0.5) * 0.15 - 0.05,
        Math.random() * 0.22 + 0.14,
        (Math.random() - 0.5) * 0.12 - 0.08
      );
      p.size = 0.08;
      p.maxSize = 0.42 + Math.random() * 0.15;
      p.alpha = 0.65;
      p.decay = 0.007;
    } else if (type === "ignite") {
      // Quick burst of smoke from lighter ignition
      p.mesh.position.copy(origin);
      p.velocity.set(
        (Math.random() - 0.5) * 0.08,
        Math.random() * 0.28 + 0.18,
        (Math.random() - 0.5) * 0.08
      );
      p.size = 0.05;
      p.maxSize = 0.28;
      p.alpha = 0.55;
      p.decay = 0.012;
    } else {
      // Gentle curling rising wisp from ember tip
      p.mesh.position.copy(origin).add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          0.01,
          (Math.random() - 0.5) * 0.01
        )
      );
      p.velocity.set(
        (Math.random() - 0.5) * 0.03 - 0.015,
        Math.random() * 0.16 + 0.1,
        (Math.random() - 0.5) * 0.03
      );
      p.size = 0.035;
      p.maxSize = 0.18;
      p.alpha = 0.5;
      p.decay = 0.009;
    }

    p.mesh.scale.set(p.size, p.size, 1);
    (p.mesh.material as THREE.MeshBasicMaterial).opacity = p.alpha;
  }

  public update(
    state: SessionState,
    emberPos: THREE.Vector3,
    camera: THREE.Camera,
    delta: number
  ): void {
    // 1. Spawning rules
    const isLit = state !== "idle";
    if (state === "lighting") {
      if (Math.random() < 0.6) {
        this.spawnSmoke(emberPos, "ignite");
      }
    } else if (state === "ready") {
      // Steady gentle wisp
      if (Math.random() < 0.55) {
        this.spawnSmoke(emberPos, "wisp");
      }
    } else if (state === "recovering") {
      // Dense cloud puff
      this.spawnSmoke(emberPos, "exhale");
    }

    // 2. Update active smoke billboards
    for (let i = 0; i < this.smokeBillboards.length; i++) {
      const p = this.smokeBillboards[i];
      if (!p.active) continue;

      p.age += delta;
      p.mesh.position.addScaledVector(p.velocity, delta);

      // Micro turbulence sway
      p.mesh.position.x += Math.sin(p.age * 4.0) * 0.001;

      // Expand size & fade alpha
      p.size = Math.min(p.maxSize, p.size + delta * 0.15);
      p.alpha -= p.decay;

      // Rotate billboard to face camera
      p.mesh.quaternion.copy(camera.quaternion);
      p.mesh.rotateZ(p.rotationSpeed * delta);
      p.mesh.scale.set(p.size, p.size, 1);

      const mat = p.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, p.alpha);

      if (p.alpha <= 0.01) {
        p.active = false;
        p.mesh.visible = false;
      }
    }

    // 3. Update rain drops
    if (this.rainLines && this.rainPositions) {
      const dropFall = this.rainSpeed * delta;
      for (let i = 0; i < this.rainCount; i++) {
        this.rainPositions[i * 6 + 1] -= dropFall;
        this.rainPositions[i * 6 + 4] -= dropFall;

        if (this.rainPositions[i * 6 + 4] < 0) {
          const resetY = 12 + Math.random() * 4;
          const dropLen = 0.38 + Math.random() * 0.22;
          this.rainPositions[i * 6 + 1] = resetY;
          this.rainPositions[i * 6 + 4] = resetY - dropLen;
        }
      }
      this.rainLines.geometry.attributes.position.needsUpdate = true;
    }
  }
}

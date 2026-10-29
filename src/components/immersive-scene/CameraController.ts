import * as THREE from "three";
import { DHAKA_SCENE_CONFIG } from "@/config/dhakaScene.config";

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private currentYaw: number = 0;
  private currentPitch: number = 0;
  private targetYaw: number = 0;
  private targetPitch: number = 0;
  private isPointerDown: boolean = false;
  private previousPointerX: number = 0;
  private previousPointerY: number = 0;
  private breathTime: number = 0;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;

    const { camera: cfg } = DHAKA_SCENE_CONFIG;
    this.camera.position.set(
      cfg.initialPosition[0],
      cfg.initialPosition[1],
      cfg.initialPosition[2]
    );
    this.camera.lookAt(
      cfg.initialTarget[0],
      cfg.initialTarget[1],
      cfg.initialTarget[2]
    );

    this.bindEvents();
  }

  private bindEvents(): void {
    // Pointer down / touch start
    this.domElement.addEventListener("pointerdown", (e) => {
      this.isPointerDown = true;
      this.previousPointerX = e.clientX;
      this.previousPointerY = e.clientY;
      try {
        this.domElement.setPointerCapture(e.pointerId);
      } catch {
        // Fallback for environments where setPointerCapture is unsupported
      }
    });

    // Pointer move / look around
    window.addEventListener("pointermove", (e) => {
      if (!this.isPointerDown) {
        // Skip hover calculations on touch screens to prevent camera jumping on mobile tap
        if (e.pointerType === "touch") return;

        // Gentle ambient hover look-around on desktop mouse move
        const deltaX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const deltaY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        this.targetYaw = -deltaX * DHAKA_SCENE_CONFIG.camera.yawLimit * 0.45;
        this.targetPitch = -deltaY * DHAKA_SCENE_CONFIG.camera.pitchLimit * 0.45;
        return;
      }

      const dx = e.clientX - this.previousPointerX;
      const dy = e.clientY - this.previousPointerY;
      this.previousPointerX = e.clientX;
      this.previousPointerY = e.clientY;

      const { camera: cfg } = DHAKA_SCENE_CONFIG;
      // Use higher touchSensitivity for mobile swipes, mouseSensitivity for desktop
      const sensitivity = e.pointerType === "touch" ? cfg.touchSensitivity : cfg.mouseSensitivity;
      this.targetYaw -= dx * sensitivity;
      this.targetPitch -= dy * sensitivity;

      // Clamp target rotation
      this.targetYaw = THREE.MathUtils.clamp(this.targetYaw, -cfg.yawLimit, cfg.yawLimit);
      this.targetPitch = THREE.MathUtils.clamp(this.targetPitch, -cfg.pitchLimit, cfg.pitchLimit);
    });

    // Pointer up / touch end / touch cancel
    const handlePointerEnd = (e: PointerEvent) => {
      this.isPointerDown = false;
      try {
        if (this.domElement.hasPointerCapture(e.pointerId)) {
          this.domElement.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Safe fallback
      }
    };
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);
  }

  public update(delta: number): void {
    const { camera: cfg } = DHAKA_SCENE_CONFIG;
    this.breathTime += delta * cfg.idleSwaySpeed;

    // Smooth lerp towards target orientation
    const lerpFactor = Math.min(1, delta * 8);
    this.currentYaw += (this.targetYaw - this.currentYaw) * lerpFactor;
    this.currentPitch += (this.targetPitch - this.currentPitch) * lerpFactor;

    // Idle organic breathing sway
    const swayYaw = Math.sin(this.breathTime * 0.8) * cfg.idleSwayAmount;
    const swayPitch = Math.cos(this.breathTime * 1.6) * (cfg.idleSwayAmount * 0.6);

    // Apply Euler rotation (order: YXZ)
    const euler = new THREE.Euler(
      this.currentPitch + swayPitch,
      this.currentYaw + swayYaw,
      0,
      "YXZ"
    );
    this.camera.quaternion.setFromEuler(euler);
  }
}


import * as THREE from "three";
import { DHAKA_SCENE_CONFIG } from "@/config/dhakaScene.config";
import { SessionState } from "@/types/session";

export class FirstPersonHand3D {
  public group: THREE.Group;
  private handMeshGroup: THREE.Group;
  private emberMesh: THREE.Mesh;
  private emberLight: THREE.PointLight;
  private emberMat: THREE.MeshStandardMaterial;
  private currentProgress: number = 0; // 0 (idle) to 1 (full inhale)
  private breathPhase: number = 0;

  constructor(emberColorHex: string = "#ff4d00") {
    this.group = new THREE.Group();
    this.group.name = "FPS_ViewModel";

    this.handMeshGroup = new THREE.Group();
    this.group.add(this.handMeshGroup);

    const { firstPersonHand } = DHAKA_SCENE_CONFIG;
    this.handMeshGroup.position.set(
      firstPersonHand.basePosition[0],
      firstPersonHand.basePosition[1],
      firstPersonHand.basePosition[2]
    );
    this.handMeshGroup.rotation.set(
      firstPersonHand.baseRotation[0],
      firstPersonHand.baseRotation[1],
      firstPersonHand.baseRotation[2]
    );

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xc88f6f, // Warm South Asian skin tone
      roughness: 0.65,
      metalness: 0.05,
    });
    const filterMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Cork amber filter
      roughness: 0.8,
    });
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // White cigarette paper
      roughness: 0.9,
    });
    const ashMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Gray ash band
      roughness: 0.95,
    });

    this.emberMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(emberColorHex),
      emissive: new THREE.Color(emberColorHex),
      emissiveIntensity: 1.6,
      roughness: 0.4,
    });

    // 1. Palm & Knuckles
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.09), skinMat);
    palm.position.set(0.04, -0.06, 0.02);
    palm.rotation.z = 0.2;
    this.handMeshGroup.add(palm);

    // 2. Index Finger (Curved holding cigarette)
    const indexFinger = new THREE.Group();
    const indexSeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.065, 8), skinMat);
    indexSeg1.position.set(0, 0.032, 0);
    indexFinger.add(indexSeg1);

    const indexSeg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.055, 8), skinMat);
    indexSeg2.position.set(0, 0.08, 0.01);
    indexSeg2.rotation.x = -0.35;
    indexFinger.add(indexSeg2);

    indexFinger.position.set(0.02, 0.03, 0.04);
    indexFinger.rotation.set(-0.25, 0.1, -0.4);
    this.handMeshGroup.add(indexFinger);

    // 3. Middle Finger (Curved under cigarette)
    const middleFinger = new THREE.Group();
    const midSeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.07, 8), skinMat);
    midSeg1.position.set(0, 0.035, 0);
    middleFinger.add(midSeg1);

    const midSeg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.055, 8), skinMat);
    midSeg2.position.set(0, 0.085, 0.01);
    midSeg2.rotation.x = -0.4;
    middleFinger.add(midSeg2);

    middleFinger.position.set(0.06, 0.025, 0.035);
    middleFinger.rotation.set(-0.35, 0.1, -0.42);
    this.handMeshGroup.add(middleFinger);

    // 4. Ring & Little Fingers (Folded into palm)
    const ringFinger = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.08, 8), skinMat);
    ringFinger.position.set(0.085, -0.01, 0.02);
    ringFinger.rotation.set(-0.6, 0, -0.5);
    this.handMeshGroup.add(ringFinger);

    const pinkyFinger = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.07, 8), skinMat);
    pinkyFinger.position.set(0.105, -0.04, 0.015);
    pinkyFinger.rotation.set(-0.7, 0, -0.55);
    this.handMeshGroup.add(pinkyFinger);

    // 5. Thumb Resting Below
    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.075, 8), skinMat);
    thumb.position.set(-0.02, -0.04, 0.045);
    thumb.rotation.set(0.4, 0.3, 0.4);
    this.handMeshGroup.add(thumb);

    // 6. The Cigarette
    const cigGroup = new THREE.Group();

    // Filter band (cork)
    const filter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.009, 0.009, 0.05, 12),
      filterMat
    );
    filter.position.y = -0.05;
    cigGroup.add(filter);

    // White paper body
    const paper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.009, 0.009, 0.12, 12),
      paperMat
    );
    paper.position.y = 0.035;
    cigGroup.add(paper);

    // Ash collar
    const ash = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0088, 0.0088, 0.012, 12),
      ashMat
    );
    ash.position.y = 0.101;
    cigGroup.add(ash);

    // Glowing Ember Tip
    this.emberMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.0085, 0.014, 12),
      this.emberMat
    );
    this.emberMesh.position.y = 0.114;
    cigGroup.add(this.emberMesh);

    // Dynamic Point Light at Ember Tip casting heat onto hand knuckles
    this.emberLight = new THREE.PointLight(0xff4d00, 1.4, 1.2);
    this.emberLight.position.set(0, 0.12, 0);
    cigGroup.add(this.emberLight);

    // Position and angle cigarette between index & middle finger
    cigGroup.position.set(0.02, 0.05, 0.06);
    cigGroup.rotation.set(0.35, -0.2, 1.25);
    this.handMeshGroup.add(cigGroup);
  }

  /**
   * Update animation loop based on session state and delta time
   */
  public update(state: SessionState, delta: number): void {
    this.breathPhase += delta * DHAKA_SCENE_CONFIG.camera.idleSwaySpeed;

    // Determine target progress towards mouth (0 = base resting pose, 1 = inhaling at mouth)
    let targetProgress = 0;
    if (state === "inhaling") {
      targetProgress = 1.0;
    } else if (state === "recovering") {
      targetProgress = 0.15;
    } else {
      targetProgress = 0;
    }

    // Smooth lerp progress
    const lerpSpeed = state === "inhaling" ? 2.5 : 1.8;
    this.currentProgress += (targetProgress - this.currentProgress) * Math.min(1, delta * lerpSpeed);

    const { firstPersonHand } = DHAKA_SCENE_CONFIG;

    // Position interpolation + subtle breathing sway
    const swayX = Math.sin(this.breathPhase) * 0.003;
    const swayY = Math.cos(this.breathPhase * 1.5) * 0.004;

    this.handMeshGroup.position.set(
      firstPersonHand.basePosition[0] + firstPersonHand.inhalePositionOffset[0] * this.currentProgress + swayX,
      firstPersonHand.basePosition[1] + firstPersonHand.inhalePositionOffset[1] * this.currentProgress + swayY,
      firstPersonHand.basePosition[2] + firstPersonHand.inhalePositionOffset[2] * this.currentProgress
    );

    this.handMeshGroup.rotation.set(
      firstPersonHand.baseRotation[0] + firstPersonHand.inhaleRotationOffset[0] * this.currentProgress,
      firstPersonHand.baseRotation[1] + firstPersonHand.inhaleRotationOffset[1] * this.currentProgress,
      firstPersonHand.baseRotation[2] + firstPersonHand.inhaleRotationOffset[2] * this.currentProgress
    );

    // Ember intensity & light flare
    const isLit = state !== "idle";
    if (!isLit) {
      this.emberMat.emissiveIntensity = 0;
      this.emberLight.intensity = 0;
    } else {
      // Inhale heats up to white-hot
      const intensity = THREE.MathUtils.lerp(
        firstPersonHand.emberBaseIntensity,
        firstPersonHand.emberInhaleIntensity,
        this.currentProgress
      );
      this.emberMat.emissiveIntensity = intensity;
      this.emberLight.intensity = intensity;

      if (this.currentProgress > 0.5) {
        this.emberMat.emissive.setHex(0xfff3d6); // White-yellow heat
        this.emberLight.color.setHex(0xffaa55);
      } else {
        this.emberMat.emissive.setHex(0xff4400); // Standard red-orange ember
        this.emberLight.color.setHex(0xff4d00);
      }
    }
  }

  /**
   * Get world coordinates of the ember tip for smoke particle spawning
   */
  public getEmberWorldPosition(): THREE.Vector3 {
    const pos = new THREE.Vector3();
    this.emberMesh.getWorldPosition(pos);
    return pos;
  }
}

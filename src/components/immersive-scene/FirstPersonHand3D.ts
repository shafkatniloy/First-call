import * as THREE from "three";
import { DHAKA_SCENE_CONFIG } from "@/config/dhakaScene.config";
import { SessionState } from "@/types/session";

export class FirstPersonHand3D {
  public group: THREE.Group;

  // Right Hand & Cigarette
  private rightHandGroup: THREE.Group;
  private cigPaperMesh!: THREE.Mesh;
  private emberMesh!: THREE.Mesh;
  private ashMesh!: THREE.Mesh;
  private emberLight!: THREE.PointLight;
  private emberMat!: THREE.MeshStandardMaterial;
  private cigGroup!: THREE.Group;

  // Left Hand & Lighter (Appears during 'lighting' state)
  private leftHandGroup: THREE.Group;
  private lighterFlame!: THREE.Mesh;
  private lighterLight!: THREE.PointLight;

  private currentProgress: number = 0; // 0 (idle) to 1 (full inhale)
  private breathPhase: number = 0;
  private lightingTransition: number = 0; // 0 (hidden) to 1 (cupping & lighting)

  // Initial dimensions of cigarette for burn-down calculation
  private initialPaperLength = 0.085;
  private filterLength = 0.038;

  constructor(emberColorHex: string = "#ff4d00") {
    this.group = new THREE.Group();
    this.group.name = "FPS_ViewModel";

    // 1. Build Organic Right Hand (Holding Cigarette)
    this.rightHandGroup = new THREE.Group();
    this.group.add(this.rightHandGroup);

    // 2. Build Organic Left Hand (Holding Lighter)
    this.leftHandGroup = new THREE.Group();
    this.group.add(this.leftHandGroup);

    const { firstPersonHand } = DHAKA_SCENE_CONFIG;
    this.rightHandGroup.position.set(
      firstPersonHand.basePosition[0],
      firstPersonHand.basePosition[1],
      firstPersonHand.basePosition[2]
    );
    this.rightHandGroup.rotation.set(
      firstPersonHand.baseRotation[0],
      firstPersonHand.baseRotation[1],
      firstPersonHand.baseRotation[2]
    );

    // Left hand starts hidden off-screen below
    this.leftHandGroup.position.set(-0.25, -0.65, -0.45);

    // Organic Skin Material with warm peach-tan tone and subtle specularity
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xcd8e70, // Warm realistic South Asian skin tone
      roughness: 0.62,
      metalness: 0.04,
    });
    const nailMat = new THREE.MeshStandardMaterial({
      color: 0xe0ab92,
      roughness: 0.35,
      metalness: 0.05,
    });

    // --- BUILD RIGHT HAND ---
    this.buildOrganicRightHand(skinMat, nailMat, emberColorHex);

    // --- BUILD LEFT HAND WITH LIGHTER ---
    this.buildOrganicLeftHand(skinMat);
  }

  /**
   * Builds an anatomically structured right hand holding a cigarette
   */
  private buildOrganicRightHand(
    skinMat: THREE.Material,
    nailMat: THREE.Material,
    emberColorHex: string
  ): void {
    // 1. Forearm segment entering from bottom right
    const forearmGeo = new THREE.CylinderGeometry(0.045, 0.065, 0.22, 12);
    const forearm = new THREE.Mesh(forearmGeo, skinMat);
    forearm.position.set(0.12, -0.17, 0.08);
    forearm.rotation.set(-0.4, 0.2, -0.5);
    this.rightHandGroup.add(forearm);

    // 2. Wrist & Palm Base (Thenar & Hypothenar bulk)
    const palmBase = new THREE.Mesh(
      new THREE.SphereGeometry(0.062, 12, 12),
      skinMat
    );
    palmBase.scale.set(1.1, 1.3, 0.7);
    palmBase.position.set(0.04, -0.05, 0.03);
    palmBase.rotation.set(0.1, -0.15, 0.25);
    this.rightHandGroup.add(palmBase);

    // Knuckle arch
    const knuckleArch = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.04, 0.05),
      skinMat
    );
    knuckleArch.position.set(0.035, 0.025, 0.04);
    knuckleArch.rotation.set(0.05, 0, 0.1);
    this.rightHandGroup.add(knuckleArch);

    // 3. Thumb (Curved naturally beneath)
    const thumbGroup = new THREE.Group();
    const thumbBase = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.055, 8), skinMat);
    thumbBase.position.set(0, 0.025, 0);
    thumbGroup.add(thumbBase);

    const thumbTip = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.016, 0.045, 8), skinMat);
    thumbTip.position.set(0, 0.065, 0.008);
    thumbTip.rotation.x = -0.35;
    thumbGroup.add(thumbTip);

    thumbGroup.position.set(-0.025, -0.04, 0.04);
    thumbGroup.rotation.set(0.45, 0.35, 0.5);
    this.rightHandGroup.add(thumbGroup);

    // 4. Index Finger (Gracefully grasping cigarette upper side)
    const indexGroup = new THREE.Group();
    const indexProx = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.015, 0.05, 8), skinMat);
    indexProx.position.y = 0.025;
    indexGroup.add(indexProx);

    const indexMid = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.045, 8), skinMat);
    indexMid.position.set(0, 0.065, 0.006);
    indexMid.rotation.x = -0.32;
    indexGroup.add(indexMid);

    const indexDist = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.035, 8), skinMat);
    indexDist.position.set(0, 0.095, 0.02);
    indexDist.rotation.x = -0.55;
    indexGroup.add(indexDist);

    // Fingernail
    const indexNail = new THREE.Mesh(new THREE.PlaneGeometry(0.009, 0.011), nailMat);
    indexNail.position.set(0, 0.108, 0.03);
    indexNail.rotation.set(-0.6, 0, 0);
    indexGroup.add(indexNail);

    indexGroup.position.set(0.015, 0.045, 0.05);
    indexGroup.rotation.set(-0.35, 0.12, -0.38);
    this.rightHandGroup.add(indexGroup);

    // 5. Middle Finger (Supporting cigarette lower side)
    const midGroup = new THREE.Group();
    const midProx = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.015, 0.055, 8), skinMat);
    midProx.position.y = 0.028;
    midGroup.add(midProx);

    const midMid = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.045, 8), skinMat);
    midMid.position.set(0, 0.07, 0.008);
    midMid.rotation.x = -0.38;
    midGroup.add(midMid);

    const midDist = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.035, 8), skinMat);
    midDist.position.set(0, 0.102, 0.022);
    midDist.rotation.x = -0.58;
    midGroup.add(midDist);

    midGroup.position.set(0.05, 0.04, 0.045);
    midGroup.rotation.set(-0.45, 0.1, -0.42);
    this.rightHandGroup.add(midGroup);

    // 6. Ring & Little Fingers (Curled naturally inward into palm)
    const ringGroup = new THREE.Group();
    const ringProx = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.05, 8), skinMat);
    ringProx.position.y = 0.025;
    ringGroup.add(ringProx);
    const ringMid = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.012, 0.045, 8), skinMat);
    ringMid.position.set(0, 0.06, 0.015);
    ringMid.rotation.x = -0.9;
    ringGroup.add(ringMid);
    ringGroup.position.set(0.075, 0.015, 0.035);
    ringGroup.rotation.set(-0.6, 0, -0.5);
    this.rightHandGroup.add(ringGroup);

    const pinkyGroup = new THREE.Group();
    const pinkyProx = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.012, 0.045, 8), skinMat);
    pinkyProx.position.y = 0.022;
    pinkyGroup.add(pinkyProx);
    const pinkyMid = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.04, 8), skinMat);
    pinkyMid.position.set(0, 0.055, 0.015);
    pinkyMid.rotation.x = -1.1;
    pinkyGroup.add(pinkyMid);
    pinkyGroup.position.set(0.095, -0.015, 0.025);
    pinkyGroup.rotation.set(-0.7, 0, -0.58);
    this.rightHandGroup.add(pinkyGroup);

    // 7. Cigarette Assembly (Cork Filter, Paper Tube, Ash Band, Glowing Ember)
    this.cigGroup = new THREE.Group();

    // Cork Filter
    const filterMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 });
    const filter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0075, 0.0075, this.filterLength, 12),
      filterMat
    );
    filter.position.y = -this.filterLength / 2;
    this.cigGroup.add(filter);

    // White Paper Body (Will dynamically scale/burn down!)
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });
    this.cigPaperMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0074, 0.0074, this.initialPaperLength, 12),
      paperMat
    );
    this.cigPaperMesh.position.y = this.initialPaperLength / 2;
    this.cigGroup.add(this.cigPaperMesh);

    // Dark Gray Ash Collar
    const ashMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, roughness: 0.95 });
    this.ashMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0073, 0.0073, 0.01, 12),
      ashMat
    );
    this.ashMesh.position.y = this.initialPaperLength + 0.005;
    this.cigGroup.add(this.ashMesh);

    // Glowing Burning Ember Tip
    this.emberMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(emberColorHex),
      emissive: new THREE.Color(emberColorHex),
      emissiveIntensity: 1.6,
      roughness: 0.35,
    });
    this.emberMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0065, 0.0072, 0.012, 12),
      this.emberMat
    );
    this.emberMesh.position.y = this.initialPaperLength + 0.015;
    this.cigGroup.add(this.emberMesh);

    // Dynamic Point Light at Ember Tip
    this.emberLight = new THREE.PointLight(0xff4d00, 1.4, 1.4);
    this.emberLight.position.y = this.initialPaperLength + 0.02;
    this.cigGroup.add(this.emberLight);

    // Orient and place cigarette between index and middle finger
    this.cigGroup.position.set(0.02, 0.065, 0.065);
    this.cigGroup.rotation.set(0.38, -0.22, 1.25);
    this.rightHandGroup.add(this.cigGroup);
  }

  /**
   * Builds the left hand holding a metallic lighter that appears when lighting
   */
  private buildOrganicLeftHand(skinMat: THREE.Material): void {
    const metalLighterMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Chrome/Steel vintage lighter
      metalness: 0.85,
      roughness: 0.25,
    });

    // Left Forearm entering from bottom left
    const leftForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.06, 0.2, 10),
      skinMat
    );
    leftForearm.position.set(-0.08, -0.16, 0.06);
    leftForearm.rotation.set(-0.35, -0.2, 0.45);
    this.leftHandGroup.add(leftForearm);

    // Left Palm cupped around lighter
    const leftPalm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.07), skinMat);
    leftPalm.position.set(0, -0.04, 0.02);
    leftPalm.rotation.set(0.2, 0.2, -0.15);
    this.leftHandGroup.add(leftPalm);

    // Cupped Left Fingers (Shielding the flame from wind!)
    for (let i = 0; i < 3; i++) {
      const finger = new THREE.Mesh(
        new THREE.CylinderGeometry(0.011, 0.013, 0.07, 8),
        skinMat
      );
      finger.position.set(0.035, 0.04 + i * 0.015, 0.02 - i * 0.015);
      finger.rotation.set(-0.5, 0.3, 0.7);
      this.leftHandGroup.add(finger);
    }

    // Chrome Lighter Body
    const lighterBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.065, 0.022),
      metalLighterMat
    );
    lighterBody.position.set(0, 0.02, 0.04);
    this.leftHandGroup.add(lighterBody);

    // Open Lighter Lid (Hinged backward)
    const lighterLid = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.025, 0.022),
      metalLighterMat
    );
    lighterLid.position.set(-0.025, 0.065, 0.04);
    lighterLid.rotation.z = 0.85;
    this.leftHandGroup.add(lighterLid);

    // Spark Wheel & Chimney
    const chimney = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.02, 0.018),
      metalLighterMat
    );
    chimney.position.set(0.005, 0.062, 0.04);
    this.leftHandGroup.add(chimney);

    // Vibrant Lighter Flame Mesh (Tear-drop flame)
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffdd44,
      transparent: true,
      opacity: 0.9,
    });
    this.lighterFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.015, 0.05, 12),
      flameMat
    );
    this.lighterFlame.position.set(0.005, 0.095, 0.04);
    this.lighterFlame.visible = false;
    this.leftHandGroup.add(this.lighterFlame);

    // Flame Point Light
    this.lighterLight = new THREE.PointLight(0xff9900, 2.5, 2.0);
    this.lighterLight.position.set(0.005, 0.1, 0.04);
    this.lighterLight.intensity = 0;
    this.leftHandGroup.add(this.lighterLight);
  }

  /**
   * Updates burning length based on draws completed
   */
  public updateBurnDown(currentDraw: number, totalDraws: number): void {
    const burnRatio = Math.min(0.72, (currentDraw / totalDraws) * 0.72);
    const newPaperLength = this.initialPaperLength * (1 - burnRatio);

    // Scale paper cylinder
    this.cigPaperMesh.scale.y = 1 - burnRatio;
    this.cigPaperMesh.position.y = newPaperLength / 2;

    // Advance ash and ember positions backward toward filter
    this.ashMesh.position.y = newPaperLength + 0.005;
    this.emberMesh.position.y = newPaperLength + 0.015;
    this.emberLight.position.y = newPaperLength + 0.02;
  }

  /**
   * Animation update loop
   */
  public update(
    state: SessionState,
    currentDraw: number,
    totalDraws: number,
    delta: number
  ): void {
    this.breathPhase += delta * DHAKA_SCENE_CONFIG.camera.idleSwaySpeed;

    // Update cigarette burn-down length
    this.updateBurnDown(currentDraw, totalDraws);

    // Inhale motion interpolation
    let targetProgress = 0;
    if (state === "inhaling") {
      targetProgress = 1.0;
    } else if (state === "recovering") {
      targetProgress = 0.15;
    } else {
      targetProgress = 0;
    }

    const lerpSpeed = state === "inhaling" ? 2.5 : 1.8;
    this.currentProgress += (targetProgress - this.currentProgress) * Math.min(1, delta * lerpSpeed);

    const { firstPersonHand } = DHAKA_SCENE_CONFIG;

    // Breathing sway
    const swayX = Math.sin(this.breathPhase) * 0.0025;
    const swayY = Math.cos(this.breathPhase * 1.5) * 0.0035;

    this.rightHandGroup.position.set(
      firstPersonHand.basePosition[0] + firstPersonHand.inhalePositionOffset[0] * this.currentProgress + swayX,
      firstPersonHand.basePosition[1] + firstPersonHand.inhalePositionOffset[1] * this.currentProgress + swayY,
      firstPersonHand.basePosition[2] + firstPersonHand.inhalePositionOffset[2] * this.currentProgress
    );

    this.rightHandGroup.rotation.set(
      firstPersonHand.baseRotation[0] + firstPersonHand.inhaleRotationOffset[0] * this.currentProgress,
      firstPersonHand.baseRotation[1] + firstPersonHand.inhaleRotationOffset[1] * this.currentProgress,
      firstPersonHand.baseRotation[2] + firstPersonHand.inhaleRotationOffset[2] * this.currentProgress
    );

    // Lighting state: Left hand brings lighter up to cigarette tip
    const isLighting = state === "lighting";
    const targetLightingTransition = isLighting ? 1.0 : 0.0;
    this.lightingTransition += (targetLightingTransition - this.lightingTransition) * Math.min(1, delta * 3.5);

    if (this.lightingTransition > 0.02) {
      this.leftHandGroup.visible = true;
      // Position left hand to cup around the cigarette tip
      const enterX = THREE.MathUtils.lerp(-0.25, -0.06, this.lightingTransition);
      const enterY = THREE.MathUtils.lerp(-0.65, -0.06, this.lightingTransition);
      const enterZ = THREE.MathUtils.lerp(-0.45, -0.32, this.lightingTransition);
      this.leftHandGroup.position.set(enterX, enterY, enterZ);

      // Flickering flame
      if (this.lightingTransition > 0.6) {
        this.lighterFlame.visible = true;
        const flicker = 0.85 + Math.random() * 0.3;
        this.lighterFlame.scale.set(flicker, flicker * (0.9 + Math.random() * 0.25), flicker);
        this.lighterLight.intensity = 2.8 * flicker;
      } else {
        this.lighterFlame.visible = false;
        this.lighterLight.intensity = 0;
      }
    } else {
      this.leftHandGroup.visible = false;
      this.lighterFlame.visible = false;
      this.lighterLight.intensity = 0;
    }

    // Ember intensity & heat flare
    const isLit = state !== "idle";
    if (!isLit) {
      this.emberMat.emissiveIntensity = 0;
      this.emberLight.intensity = 0;
    } else {
      const intensity = THREE.MathUtils.lerp(
        firstPersonHand.emberBaseIntensity,
        firstPersonHand.emberInhaleIntensity,
        this.currentProgress
      );
      this.emberMat.emissiveIntensity = intensity;
      this.emberLight.intensity = intensity;

      if (this.currentProgress > 0.45) {
        this.emberMat.emissive.setHex(0xfff5e0); // White-hot core
        this.emberLight.color.setHex(0xffaa55);
      } else {
        this.emberMat.emissive.setHex(0xff4400); // Standard warm red ember
        this.emberLight.color.setHex(0xff4d00);
      }
    }
  }

  /**
   * Get world coordinates of the burning ember tip
   */
  public getEmberWorldPosition(): THREE.Vector3 {
    this.emberMesh.updateWorldMatrix(true, false);
    const pos = new THREE.Vector3();
    this.emberMesh.getWorldPosition(pos);
    return pos;
  }
}

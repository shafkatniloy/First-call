import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ProceduralTextures } from "./ProceduralTextures";
import { SessionState } from "@/types/session";
import { BrandConfig } from "@/types/brand";

export class FirstPersonHand3D {
  public group: THREE.Group;
  private currentBrand: BrandConfig | null = null;

  // Right Hand & Cigarette
  private rightHandGroup: THREE.Group;
  private proceduralRightHandGroup: THREE.Group = new THREE.Group();
  private filterMesh!: THREE.Mesh;
  private cigPaperMesh!: THREE.Mesh;
  private emberMesh!: THREE.Mesh;
  private ashMesh!: THREE.Mesh;
  private emberLight!: THREE.PointLight;
  private emberMat!: THREE.MeshStandardMaterial;
  private cigGroup!: THREE.Group;

  // Left Hand & Lighter (Appears during 'lighting' state at the mouth)
  private leftHandGroup: THREE.Group;
  private proceduralLeftHandGroup: THREE.Group = new THREE.Group();
  private lighterFlame!: THREE.Mesh;
  private lighterLight!: THREE.PointLight;

  // Model References
  private rightSkinnedMesh: THREE.SkinnedMesh | null = null;
  private leftSkinnedMesh: THREE.SkinnedMesh | null = null;
  private skinnedRightHandModel: THREE.Group | null = null;
  private skinnedLeftHandModel: THREE.Group | null = null;
  private userCigMesh: THREE.Mesh | null = null;
  private userHandMesh: THREE.Mesh | null = null;

  // Poses:
  // 1. Resting pose (centered comfortably in the middle of the screen)
  private restPos = new THREE.Vector3(0.025, -0.025, -0.30);
  private restRot = new THREE.Euler(-1.22, -0.10, 0.22);

  // 2. Lighting pose (held steady at mouth height while lighter ignites tip)
  private lightingPos = new THREE.Vector3(0.015, -0.02, -0.24);
  private lightingRot = new THREE.Euler(-1.18, -0.06, 0.16);

  // 3. Inhale pose (drawn significantly closer to lips / screen for an immersive tactile draw)
  private inhalePos = new THREE.Vector3(0.012, -0.038, -0.16);
  private inhaleRot = new THREE.Euler(-1.12, -0.04, 0.12);

  private currentProgress: number = 0; // 0 = resting, 1 = in mouth
  private breathPhase: number = 0;
  private lightingTransition: number = 0; // 0 = hidden, 1 = lighting at mouth

  // Cigarette dimensions
  private initialPaperLength = 0.082;
  private filterLength = 0.034;
  private cigRadius = 0.0078;

  constructor(
    brandOrEmberColor?: BrandConfig | string,
    filterTone: "cork" | "white" | "gold-band" | "charcoal" = "cork"
  ) {
    let emberColorHex = "#ff4d00";
    let fTone: "cork" | "white" | "gold-band" | "charcoal" = filterTone;

    if (brandOrEmberColor && typeof brandOrEmberColor === "object") {
      this.currentBrand = brandOrEmberColor;
      emberColorHex = brandOrEmberColor.emberColor;
      fTone = brandOrEmberColor.filterTone;
    } else if (typeof brandOrEmberColor === "string") {
      emberColorHex = brandOrEmberColor;
    }

    this.group = new THREE.Group();
    this.group.name = "FPS_ViewModel";

    // 1. Right Hand Group
    this.rightHandGroup = new THREE.Group();
    this.group.add(this.rightHandGroup);
    this.rightHandGroup.add(this.proceduralRightHandGroup);
    this.proceduralRightHandGroup.visible = false;

    // 2. Left Hand Group
    this.leftHandGroup = new THREE.Group();
    this.group.add(this.leftHandGroup);
    this.leftHandGroup.add(this.proceduralLeftHandGroup);
    this.proceduralLeftHandGroup.visible = false;

    // Start in resting pose
    this.rightHandGroup.position.copy(this.restPos);
    this.rightHandGroup.rotation.copy(this.restRot);

    // Left hand starts hidden off-screen below
    this.leftHandGroup.position.set(-0.25, -0.7, -0.4);

    // Skin Material with warm peach-tan tone and natural micro-texture
    const skinTex = ProceduralTextures.createOrganicSkinTexture();
    const skinMat = new THREE.MeshStandardMaterial({
      map: skinTex,
      color: 0xc88568,
      roughness: 0.55,
      metalness: 0.02,
    });
    const nailMat = new THREE.MeshStandardMaterial({
      color: 0xdeb09a,
      roughness: 0.3,
      metalness: 0.05,
    });

    // 1. Build Cigarette First (Gripped by fingers)
    this.buildRealisticCigarette(emberColorHex, fTone);

    // 2. Build Sculpted Organic Hand Mesh
    this.buildSculptedRightHand(skinMat, nailMat);

    // 3. Build Left Hand & Lighter
    this.buildSculptedLeftHand(skinMat);

    // 4. Asynchronously Load High-Fidelity Skinned Human Hand Model if available
    this.loadSkinnedHands(skinMat);
  }

  /**
   * Builds an authentic, realistic cigarette (Not a glowing light bulb!)
   */
  private buildRealisticCigarette(
    emberColorHex: string,
    filterTone: "cork" | "white" | "gold-band" | "charcoal"
  ): void {
    this.cigGroup = new THREE.Group();

    // 1. Filter with real cork / linen / charcoal texture & metallic separator band
    const filterTex = this.currentBrand
      ? ProceduralTextures.createBrandFilterTexture(
          this.currentBrand.id,
          this.currentBrand.filterTone,
          this.currentBrand.accentColor
        )
      : ProceduralTextures.createBrandFilterTexture("classic", filterTone);

    const filterMat = new THREE.MeshStandardMaterial({
      map: filterTex,
      roughness: 0.82,
    });
    this.filterMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(this.cigRadius, this.cigRadius, this.filterLength, 32),
      filterMat
    );
    this.filterMesh.position.y = -this.filterLength / 2;
    this.cigGroup.add(this.filterMesh);

    // 2. White Paper Body with horizontal laid lines and authentic stamped brand name/crest
    const paperTex = this.currentBrand
      ? ProceduralTextures.createBrandPaperTexture(this.currentBrand)
      : ProceduralTextures.createBrandPaperTexture({
          id: "classic",
          name: "Classic",
          accentColor: "#f59e0b",
        });

    const paperMat = new THREE.MeshStandardMaterial({
      map: paperTex,
      roughness: 0.88,
    });
    this.cigPaperMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(this.cigRadius * 0.99, this.cigRadius * 0.99, this.initialPaperLength, 32),
      paperMat
    );
    this.cigPaperMesh.position.y = this.initialPaperLength / 2;
    this.cigGroup.add(this.cigPaperMesh);

    // 3. Charred Paper Burn Ring
    const ashRingMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.95,
    });
    this.ashMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(this.cigRadius * 0.98, this.cigRadius * 0.98, 0.006, 32),
      ashRingMat
    );
    this.ashMesh.position.y = this.initialPaperLength + 0.003;
    this.cigGroup.add(this.ashMesh);

    // 4. REALISTIC EMBER CONE (Porous gray ash with glowing red-hot fissures)
    const emberTex = ProceduralTextures.createEmberTexture();
    this.emberMat = new THREE.MeshStandardMaterial({
      map: emberTex,
      emissive: new THREE.Color(emberColorHex),
      emissiveMap: emberTex,
      emissiveIntensity: 0.8, // Mellow natural coal glow
      roughness: 0.75,
      metalness: 0.05,
    });

    this.emberMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(this.cigRadius * 0.78, this.cigRadius * 0.95, 0.012, 32),
      this.emberMat
    );
    this.emberMesh.position.y = this.initialPaperLength + 0.012;
    this.cigGroup.add(this.emberMesh);

    // 5. Restrained Ambient Fire Heat (Subtle warm firelight)
    this.emberLight = new THREE.PointLight(new THREE.Color(emberColorHex), 0.9, 0.8);
    this.emberLight.position.y = this.initialPaperLength + 0.015;
    this.cigGroup.add(this.emberLight);

    // Center cigarette at origin of hand group so position/rotation can be controlled directly
    this.cigGroup.position.set(0, 0, 0);
    this.cigGroup.rotation.set(0, 0, 0);
    this.rightHandGroup.add(this.cigGroup);
  }

  /**
   * Anatomically sculpted organic human right hand (Fallback mannequin while GLTF loads)
   */
  private buildSculptedRightHand(skinMat: THREE.Material, nailMat: THREE.Material): void {
    // 1. Forearm segment tapering from bottom right
    const forearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.062, 0.28, 16),
      skinMat
    );
    forearm.position.set(0.12, -0.19, 0.08);
    forearm.rotation.set(-0.45, 0.25, -0.5);
    this.proceduralRightHandGroup.add(forearm);

    // 2. Sculpted Palm with natural fleshy thenar & hypothenar muscle curves
    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 16), skinMat);
    palm.scale.set(1.15, 1.4, 0.65);
    palm.position.set(0.035, -0.045, 0.025);
    palm.rotation.set(0.12, -0.15, 0.25);
    this.proceduralRightHandGroup.add(palm);

    // Thenar thumb muscle bulk
    const thenar = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 12), skinMat);
    thenar.scale.set(0.8, 1.3, 0.8);
    thenar.position.set(-0.015, -0.04, 0.04);
    thenar.rotation.set(0.3, 0.2, 0.4);
    this.proceduralRightHandGroup.add(thenar);

    // Knuckle arch
    const knucklePad = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.08, 12), skinMat);
    knucklePad.position.set(0.035, 0.025, 0.035);
    knucklePad.rotation.z = Math.PI / 2;
    this.proceduralRightHandGroup.add(knucklePad);

    // 3. Thumb
    const thumbGroup = new THREE.Group();
    const tProx = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.019, 0.055, 10), skinMat);
    tProx.position.y = 0.025;
    thumbGroup.add(tProx);
    const tDist = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, 0.045, 10), skinMat);
    tDist.position.set(0, 0.065, 0.01);
    tDist.rotation.x = -0.38;
    thumbGroup.add(tDist);

    thumbGroup.position.set(-0.02, -0.035, 0.042);
    thumbGroup.rotation.set(0.5, 0.35, 0.55);
    this.proceduralRightHandGroup.add(thumbGroup);

    // 4. Index Finger
    const indexGroup = new THREE.Group();
    const iProx = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.0145, 0.05, 10), skinMat);
    iProx.position.y = 0.025;
    indexGroup.add(iProx);

    const iMid = new THREE.Mesh(new THREE.CylinderGeometry(0.0105, 0.012, 0.045, 10), skinMat);
    iMid.position.set(0, 0.065, 0.008);
    iMid.rotation.x = -0.38;
    indexGroup.add(iMid);

    const iDist = new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.0105, 0.038, 10), skinMat);
    iDist.position.set(0, 0.098, 0.022);
    iDist.rotation.x = -0.6;
    indexGroup.add(iDist);

    const iNail = new THREE.Mesh(new THREE.PlaneGeometry(0.008, 0.011), nailMat);
    iNail.position.set(0, 0.112, 0.031);
    iNail.rotation.set(-0.65, 0, 0);
    indexGroup.add(iNail);

    indexGroup.position.set(0.012, 0.045, 0.048);
    indexGroup.rotation.set(-0.35, 0.12, -0.38);
    this.proceduralRightHandGroup.add(indexGroup);

    // 5. Middle Finger
    const midGroup = new THREE.Group();
    const mProx = new THREE.Mesh(new THREE.CylinderGeometry(0.0125, 0.0145, 0.055, 10), skinMat);
    mProx.position.y = 0.028;
    midGroup.add(mProx);

    const mMid = new THREE.Mesh(new THREE.CylinderGeometry(0.0105, 0.0125, 0.048, 10), skinMat);
    mMid.position.set(0, 0.072, 0.01);
    mMid.rotation.x = -0.42;
    midGroup.add(mMid);

    const mDist = new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.0105, 0.038, 10), skinMat);
    mDist.position.set(0, 0.106, 0.026);
    mDist.rotation.x = -0.65;
    midGroup.add(mDist);

    midGroup.position.set(0.048, 0.042, 0.042);
    midGroup.rotation.set(-0.46, 0.1, -0.42);
    this.proceduralRightHandGroup.add(midGroup);

    // 6. Ring & Pinky Fingers
    const ringGroup = new THREE.Group();
    const rProx = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.0135, 0.048, 8), skinMat);
    rProx.position.y = 0.024;
    ringGroup.add(rProx);
    const rMid = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.042, 8), skinMat);
    rMid.position.set(0, 0.058, 0.016);
    rMid.rotation.x = -0.95;
    ringGroup.add(rMid);
    ringGroup.position.set(0.072, 0.015, 0.032);
    ringGroup.rotation.set(-0.6, 0, -0.5);
    this.proceduralRightHandGroup.add(ringGroup);

    const pinkyGroup = new THREE.Group();
    const pProx = new THREE.Mesh(new THREE.CylinderGeometry(0.0095, 0.0115, 0.042, 8), skinMat);
    pProx.position.y = 0.021;
    pinkyGroup.add(pProx);
    const pMid = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0095, 0.038, 8), skinMat);
    pMid.position.set(0, 0.052, 0.016);
    pMid.rotation.x = -1.15;
    pinkyGroup.add(pMid);
    pinkyGroup.position.set(0.092, -0.015, 0.022);
    pinkyGroup.rotation.set(-0.72, 0, -0.58);
    this.proceduralRightHandGroup.add(pinkyGroup);
  }

  /**
   * Anatomical Left Hand holding vintage steel lighter (Fallback mannequin while GLTF loads)
   */
  private buildSculptedLeftHand(skinMat: THREE.Material): void {
    const lighterMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.25,
    });

    const lForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.058, 0.22, 12), skinMat);
    lForearm.position.set(-0.07, -0.16, 0.05);
    lForearm.rotation.set(-0.35, -0.2, 0.45);
    this.proceduralLeftHandGroup.add(lForearm);

    const lPalm = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 12), skinMat);
    lPalm.scale.set(1.1, 1.3, 0.7);
    lPalm.position.set(0, -0.04, 0.02);
    lPalm.rotation.set(0.2, 0.2, -0.15);
    this.proceduralLeftHandGroup.add(lPalm);

    // Cupped wind-shielding fingers
    for (let i = 0; i < 3; i++) {
      const f = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.012, 0.065, 8), skinMat);
      f.position.set(0.028, 0.035 + i * 0.016, 0.022 - i * 0.014);
      f.rotation.set(-0.55, 0.35, 0.72);
      this.proceduralLeftHandGroup.add(f);
    }

    // Chrome lighter body
    const lighterBody = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.06, 0.02), lighterMat);
    lighterBody.position.set(0, 0.02, 0.038);
    this.proceduralLeftHandGroup.add(lighterBody);

    // Hinged open lid
    const lighterLid = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.024, 0.02), lighterMat);
    lighterLid.position.set(-0.022, 0.062, 0.038);
    lighterLid.rotation.z = 0.85;
    this.proceduralLeftHandGroup.add(lighterLid);

    // Spark wheel chimney
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.018, 0.016), lighterMat);
    chimney.position.set(0.004, 0.058, 0.038);
    this.proceduralLeftHandGroup.add(chimney);

    // Realistic Teardrop Flame Mesh
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffcc33,
      transparent: true,
      opacity: 0.9,
    });
    this.lighterFlame = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.048, 12), flameMat);
    this.lighterFlame.position.set(0.004, 0.088, 0.038);
    this.lighterFlame.visible = false;
    this.leftHandGroup.add(this.lighterFlame);

    // Flame Point Light
    this.lighterLight = new THREE.PointLight(0xff9900, 2.2, 1.8);
    this.lighterLight.position.set(0.004, 0.092, 0.038);
    this.lighterLight.intensity = 0;
    this.leftHandGroup.add(this.lighterLight);
  }

  /**
   * Hand models disabled for now per user instruction ("will work on it later")
   */
  private loadSkinnedHands(_skinMat: THREE.Material): void {
    // Keep hand meshes disabled so only the cigarette is rendered in view
    this.proceduralRightHandGroup.visible = false;
    this.proceduralLeftHandGroup.visible = false;
  }

  private loadFallbackSkinnedHands(_skinMat: THREE.Material): void {
    // Fallback hands also disabled
  }

  /**
   * Dynamically updates brand styling (ember color, filter texture, and authentic brand paper livery)
   */
  public updateBrand(
    brandOrEmberColor: BrandConfig | string,
    filterTone?: "cork" | "white" | "gold-band" | "charcoal"
  ): void {
    let emberColorHex = "#ff4d00";
    let fTone: "cork" | "white" | "gold-band" | "charcoal" = filterTone || "cork";

    if (typeof brandOrEmberColor === "object") {
      this.currentBrand = brandOrEmberColor;
      emberColorHex = brandOrEmberColor.emberColor;
      fTone = brandOrEmberColor.filterTone;
    } else {
      emberColorHex = brandOrEmberColor;
    }

    if (this.emberMat) {
      this.emberMat.emissive.set(emberColorHex);
    }
    if (this.emberLight) {
      this.emberLight.color.set(emberColorHex);
    }

    if (this.currentBrand) {
      const filterTex = ProceduralTextures.createBrandFilterTexture(
        this.currentBrand.id,
        this.currentBrand.filterTone,
        this.currentBrand.accentColor
      );
      if (this.filterMesh) {
        (this.filterMesh.material as THREE.MeshStandardMaterial).map = filterTex;
        (this.filterMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
      }

      const paperTex = ProceduralTextures.createBrandPaperTexture(this.currentBrand);
      if (this.cigPaperMesh) {
        (this.cigPaperMesh.material as THREE.MeshStandardMaterial).map = paperTex;
        (this.cigPaperMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
      }
    } else {
      const filterTex = ProceduralTextures.createBrandFilterTexture("classic", fTone);
      if (this.filterMesh) {
        (this.filterMesh.material as THREE.MeshStandardMaterial).map = filterTex;
        (this.filterMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
      }
    }
  }

  /**
   * Physically burns down the cigarette as draws progress without distorting the brand stamping
   */
  public updateBurnDown(currentDraw: number, totalDraws: number): void {
    const burnRatio = Math.min(0.75, (currentDraw / totalDraws) * 0.75);
    const newPaperLength = this.initialPaperLength * (1 - burnRatio);

    this.cigPaperMesh.scale.y = 1 - burnRatio;
    this.cigPaperMesh.position.y = newPaperLength / 2;

    // Keep the brand stamping at the filter junction 100% undistorted
    if (this.cigPaperMesh.material && (this.cigPaperMesh.material as THREE.MeshStandardMaterial).map) {
      const map = (this.cigPaperMesh.material as THREE.MeshStandardMaterial).map!;
      map.repeat.y = 1 - burnRatio;
      map.offset.y = 0;
      map.needsUpdate = true;
    }

    this.ashMesh.position.y = newPaperLength + 0.003;
    this.emberMesh.position.y = newPaperLength + 0.012;
    this.emberLight.position.y = newPaperLength + 0.015;
  }

  /**
   * Main animation loop — Handles mouth-lighting, mouth-inhaling, and resting poses
   */
  public update(
    state: SessionState,
    currentDraw: number,
    totalDraws: number,
    delta: number
  ): void {
    this.breathPhase += delta * 1.1;

    // Update cigarette burn-down
    this.updateBurnDown(currentDraw, totalDraws);

    // POSE TARGET:
    // When state is 'inhaling', cigarette draws significantly closer to the lips/camera (inhalePos).
    // When state is 'lighting', cigarette raises to mouth level aligned with lighter (lightingPos).
    // When state is 'recovering', it smoothly eases away from mouth back toward resting.
    // When state is 'ready' or 'idle', it rests comfortably in foreground center.
    let targetProgress = 0;
    if (state === "lighting" || state === "inhaling") {
      targetProgress = 1.0;
    } else if (state === "recovering") {
      targetProgress = 0.15; // Smoothly easing away from mouth back toward resting
    } else {
      targetProgress = 0.0;
    }

    const lerpSpeed = state === "inhaling" ? 2.8 : state === "lighting" ? 2.6 : 1.8;
    this.currentProgress += (targetProgress - this.currentProgress) * Math.min(1, delta * lerpSpeed);

    // Subtle breath sway
    const swayX = Math.sin(this.breathPhase) * 0.002;
    const swayY = Math.cos(this.breathPhase * 1.5) * 0.003;

    // Active destination: inhale brings it much closer than lighting
    const activeTargetPos = state === "lighting" ? this.lightingPos : this.inhalePos;
    const activeTargetRot = state === "lighting" ? this.lightingRot : this.inhaleRot;

    // Interpolate right hand position between resting pose and active target pose
    this.rightHandGroup.position.lerpVectors(this.restPos, activeTargetPos, this.currentProgress);
    this.rightHandGroup.position.x += swayX;
    this.rightHandGroup.position.y += swayY;

    // Interpolate rotation
    this.rightHandGroup.rotation.x = THREE.MathUtils.lerp(this.restRot.x, activeTargetRot.x, this.currentProgress);
    this.rightHandGroup.rotation.y = THREE.MathUtils.lerp(this.restRot.y, activeTargetRot.y, this.currentProgress);
    this.rightHandGroup.rotation.z = THREE.MathUtils.lerp(this.restRot.z, activeTargetRot.z, this.currentProgress);

    // LIGHTING INTERACTION (Left hand raises lighter directly to the cigarette tip in the mouth!)
    const isLighting = state === "lighting";
    const targetLightingTransition = isLighting ? 1.0 : 0.0;
    this.lightingTransition += (targetLightingTransition - this.lightingTransition) * Math.min(1, delta * 3.2);

    if (this.lightingTransition > 0.02) {
      this.leftHandGroup.visible = true;
      // Bring lighter right up to the cigarette tip
      const enterX = THREE.MathUtils.lerp(-0.15, -0.004, this.lightingTransition);
      const enterY = THREE.MathUtils.lerp(-0.35, -0.074, this.lightingTransition);
      const enterZ = THREE.MathUtils.lerp(-0.35, -0.364, this.lightingTransition);
      this.leftHandGroup.position.set(enterX, enterY, enterZ);

      // Flame flickers right at the tip
      if (this.lightingTransition > 0.5) {
        this.lighterFlame.visible = true;
        const flicker = 0.85 + Math.random() * 0.3;
        this.lighterFlame.scale.set(flicker, flicker * (0.9 + Math.random() * 0.25), flicker);
        this.lighterLight.intensity = 2.4 * flicker;
      } else {
        this.lighterFlame.visible = false;
        this.lighterLight.intensity = 0;
      }
    } else {
      this.leftHandGroup.visible = false;
      this.lighterFlame.visible = false;
      this.lighterLight.intensity = 0;
    }

    // EMBER HEAT (Mellow coal fire, flares when inhaling)
    const isLit = state !== "idle";
    if (!isLit) {
      this.emberMat.emissiveIntensity = 0;
      this.emberLight.intensity = 0;
    } else {
      const inhaleHeat = (state === "inhaling" || state === "lighting") ? 1.0 : 0.0;
      const intensity = THREE.MathUtils.lerp(0.8, 2.6, inhaleHeat);
      this.emberMat.emissiveIntensity = intensity;
      this.emberLight.intensity = intensity;

      if (inhaleHeat > 0.5) {
        this.emberMat.emissive.setHex(0xff6611); // Hot orange burning coal
        this.emberLight.color.setHex(0xff8833);
      } else {
        this.emberMat.emissive.setHex(0xcc3300); // Mellow natural ember
        this.emberLight.color.setHex(0xff4400);
      }
    }
  }

  /**
   * Get world position of the ember tip for smoke particle spawning
   */
  public getEmberWorldPosition(): THREE.Vector3 {
    this.emberMesh.updateWorldMatrix(true, false);
    const pos = new THREE.Vector3();
    this.emberMesh.getWorldPosition(pos);
    return pos;
  }

  /**
   * Get mouth position for exhale smoke cloud spawning (below eye level at lips)
   */
  public getMouthWorldPosition(): THREE.Vector3 {
    const mouthLocal = new THREE.Vector3(0.012, -0.038, -0.16);
    mouthLocal.applyMatrix4(this.group.matrixWorld);
    return mouthLocal;
  }
}

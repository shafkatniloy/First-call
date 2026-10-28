import * as THREE from "three";
import { ProceduralTextures } from "./ProceduralTextures";
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

  // Left Hand & Lighter (Appears during 'lighting' state at the mouth)
  private leftHandGroup: THREE.Group;
  private lighterFlame!: THREE.Mesh;
  private lighterLight!: THREE.PointLight;

  // Poses:
  // 1. Resting pose (down in lower-right foreground between draws)
  private restPos = new THREE.Vector3(0.18, -0.19, -0.38);
  private restRot = new THREE.Euler(-0.15, -0.28, 0.22);

  // 2. Mouth pose (cigarette directly in the player's mouth at bottom-center)
  // Filter is at lips [0, -0.07, -0.11], cigarette angled forward into scene
  private mouthPos = new THREE.Vector3(0.045, -0.082, -0.165);
  private mouthRot = new THREE.Euler(0.24, -0.12, 0.15);

  private currentProgress: number = 0; // 0 = resting, 1 = in mouth
  private breathPhase: number = 0;
  private lightingTransition: number = 0; // 0 = hidden, 1 = lighting at mouth

  // Cigarette dimensions
  private initialPaperLength = 0.082;
  private filterLength = 0.034;
  private cigRadius = 0.0078;

  constructor(emberColorHex: string = "#ff4d00", filterTone: "cork" | "white" | "gold-band" | "charcoal" = "cork") {
    this.group = new THREE.Group();
    this.group.name = "FPS_ViewModel";

    // 1. Right Hand Group
    this.rightHandGroup = new THREE.Group();
    this.group.add(this.rightHandGroup);

    // 2. Left Hand (Lighter) Group
    this.leftHandGroup = new THREE.Group();
    this.group.add(this.leftHandGroup);

    // Start in resting pose
    this.rightHandGroup.position.copy(this.restPos);
    this.rightHandGroup.rotation.copy(this.restRot);

    // Left hand starts hidden off-screen below
    this.leftHandGroup.position.set(-0.25, -0.7, -0.4);

    // Organic Skin Material with procedural pore & crease map
    const skinTex = ProceduralTextures.createOrganicSkinTexture();
    const skinMat = new THREE.MeshStandardMaterial({
      map: skinTex,
      color: 0xcb8d6f,
      roughness: 0.58,
      metalness: 0.02,
    });
    const nailMat = new THREE.MeshStandardMaterial({
      color: 0xdeb09a,
      roughness: 0.3,
      metalness: 0.05,
    });

    // Build models
    this.buildOrganicRightHand(skinMat, nailMat, emberColorHex, filterTone);
    this.buildOrganicLeftHand(skinMat);
  }

  /**
   * Anatomically sculpted organic human right hand holding cigarette
   */
  private buildOrganicRightHand(
    skinMat: THREE.Material,
    nailMat: THREE.Material,
    emberColorHex: string,
    filterTone: "cork" | "white" | "gold-band" | "charcoal"
  ): void {
    // 1. Forearm (Extending naturally from bottom-right)
    const forearmGeo = new THREE.CylinderGeometry(0.042, 0.062, 0.26, 16);
    const forearm = new THREE.Mesh(forearmGeo, skinMat);
    forearm.position.set(0.11, -0.19, 0.08);
    forearm.rotation.set(-0.45, 0.25, -0.5);
    this.rightHandGroup.add(forearm);

    // 2. Anatomical Palm & Thenar Muscle (Soft rounded curves, not robotic blocks!)
    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 16), skinMat);
    palm.scale.set(1.15, 1.4, 0.65);
    palm.position.set(0.035, -0.045, 0.025);
    palm.rotation.set(0.12, -0.15, 0.25);
    this.rightHandGroup.add(palm);

    // Fleshy thumb muscle (thenar eminence)
    const thenar = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), skinMat);
    thenar.scale.set(0.8, 1.3, 0.8);
    thenar.position.set(-0.015, -0.04, 0.04);
    thenar.rotation.set(0.3, 0.2, 0.4);
    this.rightHandGroup.add(thenar);

    // Knuckle pads
    const knucklePad = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.08, 12), skinMat);
    knucklePad.position.set(0.035, 0.025, 0.035);
    knucklePad.rotation.z = Math.PI / 2;
    this.rightHandGroup.add(knucklePad);

    // 3. Thumb (Resting gently below index finger)
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
    this.rightHandGroup.add(thumbGroup);

    // 4. Index Finger (Curved gracefully holding upper side of cigarette)
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

    // Fingernail
    const iNail = new THREE.Mesh(new THREE.PlaneGeometry(0.008, 0.011), nailMat);
    iNail.position.set(0, 0.112, 0.031);
    iNail.rotation.set(-0.65, 0, 0);
    indexGroup.add(iNail);

    indexGroup.position.set(0.012, 0.045, 0.048);
    indexGroup.rotation.set(-0.35, 0.12, -0.38);
    this.rightHandGroup.add(indexGroup);

    // 5. Middle Finger (Curved gracefully supporting lower side of cigarette)
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
    this.rightHandGroup.add(midGroup);

    // 6. Ring & Little Fingers (Curled naturally into palm)
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
    this.rightHandGroup.add(ringGroup);

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
    this.rightHandGroup.add(pinkyGroup);

    // 7. REALISTIC CIGARETTE ASSEMBLY
    this.cigGroup = new THREE.Group();

    // Textured Cork / White Filter with Gold Ring
    const cigTex = ProceduralTextures.createCigaretteTexture(filterTone);
    const filterMat = new THREE.MeshStandardMaterial({
      map: cigTex,
      roughness: 0.8,
    });
    const filterMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(this.cigRadius, this.cigRadius, this.filterLength, 16),
      filterMat
    );
    filterMesh.position.y = -this.filterLength / 2;
    this.cigGroup.add(filterMesh);

    // White Rolling Paper Tube (Shortens as it burns!)
    const paperMat = new THREE.MeshStandardMaterial({
      map: cigTex,
      roughness: 0.85,
    });
    this.cigPaperMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(this.cigRadius * 0.99, this.cigRadius * 0.99, this.initialPaperLength, 16),
      paperMat
    );
    this.cigPaperMesh.position.y = this.initialPaperLength / 2;
    this.cigGroup.add(this.cigPaperMesh);

    // Charred Black Tobacco Burn Line
    const ashMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.95,
    });
    this.ashMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(this.cigRadius * 0.98, this.cigRadius * 0.98, 0.008, 16),
      ashMat
    );
    this.ashMesh.position.y = this.initialPaperLength + 0.004;
    this.cigGroup.add(this.ashMesh);

    // REALISTIC EMBER (Textured burning coal with gray ash crust — NOT a lightbulb!)
    const emberTex = ProceduralTextures.createEmberTexture();
    this.emberMat = new THREE.MeshStandardMaterial({
      map: emberTex,
      emissive: new THREE.Color(emberColorHex),
      emissiveMap: emberTex,
      emissiveIntensity: 1.2,
      roughness: 0.7,
      metalness: 0.1,
    });

    // Ember cone
    this.emberMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(this.cigRadius * 0.82, this.cigRadius * 0.96, 0.014, 16),
      this.emberMat
    );
    this.emberMesh.position.y = this.initialPaperLength + 0.014;
    this.cigGroup.add(this.emberMesh);

    // Soft Ambient Heat Glow (Restrained, natural fire warmth)
    this.emberLight = new THREE.PointLight(0xff4d00, 1.2, 1.0);
    this.emberLight.position.y = this.initialPaperLength + 0.018;
    this.cigGroup.add(this.emberLight);

    // Orientation: gripped naturally between index and middle finger
    this.cigGroup.position.set(0.018, 0.065, 0.062);
    this.cigGroup.rotation.set(0.38, -0.2, 1.24);
    this.rightHandGroup.add(this.cigGroup);
  }

  /**
   * Anatomical Left Hand holding vintage steel lighter
   */
  private buildOrganicLeftHand(skinMat: THREE.Material): void {
    const lighterMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.25,
    });

    // Left forearm
    const lForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.058, 0.22, 12), skinMat);
    lForearm.position.set(-0.07, -0.16, 0.05);
    lForearm.rotation.set(-0.35, -0.2, 0.45);
    this.leftHandGroup.add(lForearm);

    // Left Palm cupped around lighter
    const lPalm = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 12), skinMat);
    lPalm.scale.set(1.1, 1.3, 0.7);
    lPalm.position.set(0, -0.04, 0.02);
    lPalm.rotation.set(0.2, 0.2, -0.15);
    this.leftHandGroup.add(lPalm);

    // Cupped wind-shielding fingers
    for (let i = 0; i < 3; i++) {
      const f = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.012, 0.065, 8), skinMat);
      f.position.set(0.028, 0.035 + i * 0.016, 0.022 - i * 0.014);
      f.rotation.set(-0.55, 0.35, 0.72);
      this.leftHandGroup.add(f);
    }

    // Chrome lighter body
    const lighterBody = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.06, 0.02), lighterMat);
    lighterBody.position.set(0, 0.02, 0.038);
    this.leftHandGroup.add(lighterBody);

    // Hinged open lid
    const lighterLid = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.024, 0.02), lighterMat);
    lighterLid.position.set(-0.022, 0.062, 0.038);
    lighterLid.rotation.z = 0.85;
    this.leftHandGroup.add(lighterLid);

    // Spark wheel chimney
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.018, 0.016), lighterMat);
    chimney.position.set(0.004, 0.058, 0.038);
    this.leftHandGroup.add(chimney);

    // Flame mesh
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffcc33,
      transparent: true,
      opacity: 0.9,
    });
    this.lighterFlame = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.048, 12), flameMat);
    this.lighterFlame.position.set(0.004, 0.088, 0.038);
    this.lighterFlame.visible = false;
    this.leftHandGroup.add(this.lighterFlame);

    // Flame light
    this.lighterLight = new THREE.PointLight(0xff9900, 2.2, 1.8);
    this.lighterLight.position.set(0.004, 0.092, 0.038);
    this.lighterLight.intensity = 0;
    this.leftHandGroup.add(this.lighterLight);
  }

  /**
   * Physically burns down the cigarette as draws progress
   */
  public updateBurnDown(currentDraw: number, totalDraws: number): void {
    const burnRatio = Math.min(0.75, (currentDraw / totalDraws) * 0.75);
    const newPaperLength = this.initialPaperLength * (1 - burnRatio);

    this.cigPaperMesh.scale.y = 1 - burnRatio;
    this.cigPaperMesh.position.y = newPaperLength / 2;

    this.ashMesh.position.y = newPaperLength + 0.004;
    this.emberMesh.position.y = newPaperLength + 0.014;
    this.emberLight.position.y = newPaperLength + 0.018;
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

    // DETERMINE POSE TARGET:
    // When state is 'lighting' OR 'inhaling', cigarette MUST be directly in the mouth!
    // When state is 'recovering', it smoothly leaves the mouth back to resting.
    // When state is 'ready' or 'idle', it rests naturally down in the lower-right foreground.
    let targetMouthProgress = 0;
    if (state === "lighting" || state === "inhaling") {
      targetMouthProgress = 1.0; // In mouth!
    } else if (state === "recovering") {
      targetMouthProgress = 0.2; // Easing away from mouth
    } else {
      targetMouthProgress = 0; // Relaxed in hand
    }

    // Lerp smoothly into/out of mouth
    const lerpSpeed = (state === "inhaling" || state === "lighting") ? 2.6 : 1.7;
    this.currentProgress += (targetMouthProgress - this.currentProgress) * Math.min(1, delta * lerpSpeed);

    // Subtle breath sway
    const swayX = Math.sin(this.breathPhase) * 0.002;
    const swayY = Math.cos(this.breathPhase * 1.5) * 0.003;

    // Interpolate right hand position between resting pose and mouth pose!
    this.rightHandGroup.position.lerpVectors(this.restPos, this.mouthPos, this.currentProgress);
    this.rightHandGroup.position.x += swayX;
    this.rightHandGroup.position.y += swayY;

    // Interpolate rotation
    this.rightHandGroup.rotation.x = THREE.MathUtils.lerp(this.restRot.x, this.mouthRot.x, this.currentProgress);
    this.rightHandGroup.rotation.y = THREE.MathUtils.lerp(this.restRot.y, this.mouthRot.y, this.currentProgress);
    this.rightHandGroup.rotation.z = THREE.MathUtils.lerp(this.restRot.z, this.mouthRot.z, this.currentProgress);

    // LIGHTING INTERACTION (Left hand raises lighter directly to the cigarette tip in the mouth!)
    const isLighting = state === "lighting";
    const targetLightingTransition = isLighting ? 1.0 : 0.0;
    this.lightingTransition += (targetLightingTransition - this.lightingTransition) * Math.min(1, delta * 3.2);

    if (this.lightingTransition > 0.02) {
      this.leftHandGroup.visible = true;
      // Bring lighter right up to the cigarette tip in the mouth: [x: -0.04, y: -0.09, z: -0.22]
      const enterX = THREE.MathUtils.lerp(-0.25, -0.035, this.lightingTransition);
      const enterY = THREE.MathUtils.lerp(-0.7, -0.095, this.lightingTransition);
      const enterZ = THREE.MathUtils.lerp(-0.4, -0.22, this.lightingTransition);
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

    // EMBER HEAT FLARE (Natural fire coal glow, not a bulb!)
    const isLit = state !== "idle";
    if (!isLit) {
      this.emberMat.emissiveIntensity = 0;
      this.emberLight.intensity = 0;
    } else {
      // Heating up when inhaling in mouth or lighting
      const inhaleHeat = (state === "inhaling" || state === "lighting") ? 1.0 : 0.0;
      const intensity = THREE.MathUtils.lerp(1.1, 3.4, inhaleHeat);
      this.emberMat.emissiveIntensity = intensity;
      this.emberLight.intensity = intensity;

      if (inhaleHeat > 0.5) {
        this.emberMat.emissive.setHex(0xff7722); // Hot orange fire
        this.emberLight.color.setHex(0xffaa44);
      } else {
        this.emberMat.emissive.setHex(0xd94400); // Mellow glowing ember
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
   * Get mouth position for exhale smoke cloud spawning
   */
  public getMouthWorldPosition(): THREE.Vector3 {
    const mouthLocal = new THREE.Vector3(0, -0.065, -0.14);
    mouthLocal.applyMatrix4(this.group.matrixWorld);
    return mouthLocal;
  }
}

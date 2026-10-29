import * as THREE from "three";
import { ProceduralTextures } from "./ProceduralTextures";
import { DhakaProps } from "./DhakaProps";
import { StreetNPCs } from "./StreetNPCs";
import { DHAKA_SCENE_CONFIG } from "@/config/dhakaScene.config";

export class SceneWorld {
  public scene: THREE.Scene;
  private streetLamps: THREE.PointLight[] = [];
  private ambientLight!: THREE.AmbientLight;
  private sunMoonLight!: THREE.DirectionalLight;
  private teaStallBulb: THREE.PointLight | null = null;
  private posterWallLight: THREE.PointLight | null = null;
  private backdropBuilding: THREE.Mesh | null = null;
  private skyMesh: THREE.Mesh | null = null;
  private animatedNPCs: ((delta: number, time: number) => void)[] = [];

  constructor() {
    this.scene = new THREE.Scene();
    this.setupAtmosphere();
    this.buildGroundAndRoad();
    this.buildBuildings();
    this.buildStreetProps();
    this.buildOverheadWiring();
  }

  /**
   * Atmosphere: Panoramic Sky Dome, Background sky color & Exponential Fog
   */
  private setupAtmosphere(): void {
    const { lighting } = DHAKA_SCENE_CONFIG;
    this.scene.background = new THREE.Color(lighting.fogColor);
    this.scene.fog = new THREE.FogExp2(lighting.fogColor, lighting.fogDensity);

    // 1. Panoramic Sky Dome (Inverted Sphere)
    const skyGeo = new THREE.SphereGeometry(65, 32, 24);
    const skyMat = new THREE.MeshBasicMaterial({
      map: ProceduralTextures.createNightSkyTexture(),
      side: THREE.BackSide,
      depthWrite: false,
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(this.skyMesh);

    // 2. Ambient Fill Light
    this.ambientLight = new THREE.AmbientLight(
      lighting.ambientColor,
      lighting.ambientIntensity
    );
    this.scene.add(this.ambientLight);

    // 3. Directional Celestial Light (Sun in Daytime / Moon at Night)
    this.sunMoonLight = new THREE.DirectionalLight(
      lighting.moonColor,
      lighting.moonIntensity
    );
    this.sunMoonLight.position.set(
      lighting.moonPosition[0],
      lighting.moonPosition[1],
      lighting.moonPosition[2]
    );
    this.sunMoonLight.castShadow = true;
    this.sunMoonLight.shadow.mapSize.width = 1024;
    this.sunMoonLight.shadow.mapSize.height = 1024;
    this.sunMoonLight.shadow.camera.near = 0.5;
    this.sunMoonLight.shadow.camera.far = 60;
    this.scene.add(this.sunMoonLight);
  }

  /**
   * Asphalt Road with lane lines & Curbed Sidewalks
   */
  private buildGroundAndRoad(): void {
    const roadLength = 70;
    const roadWidth = 5.2;

    // 1. Center Wet Asphalt Road
    const roadMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createWetRoad(),
      roughness: 0.35,
      metalness: 0.25,
    });
    // Repeat texture along road length
    if (roadMat.map) {
      roadMat.map.repeat.set(1, 14);
    }
    const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength);
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -10);
    road.receiveShadow = true;
    this.scene.add(road);

    // 2. Left & Right Curbed Sidewalks
    const sidewalkMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.9,
    });
    const curbMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
    });

    const sidewalkWidth = 2.4;
    const curbHeight = 0.16;

    // Left Sidewalk
    const leftSidewalk = new THREE.Mesh(
      new THREE.BoxGeometry(sidewalkWidth, curbHeight, roadLength),
      sidewalkMat
    );
    leftSidewalk.position.set(-roadWidth / 2 - sidewalkWidth / 2, curbHeight / 2, -10);
    leftSidewalk.receiveShadow = true;
    this.scene.add(leftSidewalk);

    // Right Sidewalk
    const rightSidewalk = new THREE.Mesh(
      new THREE.BoxGeometry(sidewalkWidth, curbHeight, roadLength),
      sidewalkMat
    );
    rightSidewalk.position.set(roadWidth / 2 + sidewalkWidth / 2, curbHeight / 2, -10);
    rightSidewalk.receiveShadow = true;
    this.scene.add(rightSidewalk);
  }

  /**
   * Modular Concrete Dhaka Buildings
   */
  private buildBuildings(): void {
    const concreteMatA = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createConcreteFacade("#334155"),
      roughness: 0.85,
    });
    const concreteMatB = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createConcreteFacade("#475569"),
      roughness: 0.85,
    });
    const shutterMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createMetalShutter("#1e293b"),
      roughness: 0.6,
    });
    const railingMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.3,
    });
    const waterTankMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1, // Gazi Tank blue
      roughness: 0.5,
    });

    // --- LEFT SIDE BUILDINGS ---

    // Building L1 (Pharmacy & Apartments)
    const bL1 = new THREE.Group();
    const bL1Mesh = new THREE.Mesh(new THREE.BoxGeometry(7, 12, 10), concreteMatA);
    bL1Mesh.position.set(-6.5, 6, 2);
    bL1Mesh.castShadow = true;
    bL1Mesh.receiveShadow = true;
    bL1.add(bL1Mesh);

    // Ground floor roll-down metal shutters
    for (let i = 0; i < 2; i++) {
      const shutter = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.6), shutterMat);
      shutter.position.set(-3.01, 1.45, 1.5 + i * 2.6);
      shutter.rotation.y = Math.PI / 2;
      bL1.add(shutter);
    }

    // Bengali Shop Sign ("মা ফার্মেসী") — High-Visibility Backlit Sign
    const pharmacySignTex = ProceduralTextures.createBengaliSign(
      "মা ফার্মেসী",
      "ঔষধ ও সার্জিক্যাল পণ্য সামগ্রী",
      "বিসমিল্লাহির রাহমানির রাহীম",
      "#022c22",
      "#ffffff",
      "#10b981",
      true
    );
    const pharmacySign = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 0.9),
      new THREE.MeshStandardMaterial({
        map: pharmacySignTex,
        emissiveMap: pharmacySignTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.9,
        roughness: 0.25,
      })
    );
    pharmacySign.position.set(-2.98, 3.2, 2.0);
    pharmacySign.rotation.y = Math.PI / 2;
    bL1.add(pharmacySign);

    // Weathered Street Wall Posters pasted on Building L1 wall
    const toLetPosterTex = ProceduralTextures.createStreetPoster(
      "টু-লেট / TO-LET",
      "বাড়ি ভাড়া",
      "৩ রুম, ২ বাথ, ড্রয়িং-ডাইনিং\nলিফট ও জেনারেটর সুবিধা\nপরিবার / চাকুরিজীবী",
      "যোগাযোগ: ০১৭১১-২৪XXXX",
      "#fef08a",
      "#b91c1c",
      "#1e1b4b"
    );
    const toLetPoster = new THREE.Mesh(
      new THREE.PlaneGeometry(0.72, 1.02),
      new THREE.MeshStandardMaterial({
        map: toLetPosterTex,
        emissiveMap: toLetPosterTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.5,
        roughness: 0.8,
      })
    );
    toLetPoster.position.set(-2.97, 1.6, 4.2);
    toLetPoster.rotation.y = Math.PI / 2;
    bL1.add(toLetPoster);

    // Authentic Election Poster pasted directly on Building L1 sidewall beside tea stall under the light
    const textureLoader = new THREE.TextureLoader();
    const electionPosterTex = textureLoader.load("/assets/election_poster.jpg", () => {
      electionPosterTex.colorSpace = THREE.SRGBColorSpace;
      electionWallPosterMat.needsUpdate = true;
    });

    const electionWallPosterMat = new THREE.MeshStandardMaterial({
      map: electionPosterTex,
      emissiveMap: electionPosterTex,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.58,
      roughness: 0.7,
      metalness: 0.02,
    });
    const bL1ElectionPoster = new THREE.Mesh(
      new THREE.PlaneGeometry(0.82, 1.10),
      electionWallPosterMat
    );
    bL1ElectionPoster.position.set(-2.96, 1.42, 0.05);
    bL1ElectionPoster.rotation.y = Math.PI / 2;
    bL1.add(bL1ElectionPoster);

    // Wall-mounted vintage gooseneck lamp fixture directly above poster on sidewall
    const posterLampFixture = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.09, 0.1, 10),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 })
    );
    posterLampFixture.position.set(-2.88, 2.15, 0.05);
    posterLampFixture.rotation.z = Math.PI / 3;
    bL1.add(posterLampFixture);

    const posterLampBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffe099 })
    );
    posterLampBulb.position.set(-2.84, 2.10, 0.05);
    bL1.add(posterLampBulb);

    const posterWallLight = new THREE.PointLight(0xffaa40, 2.8, 5.0);
    posterWallLight.position.set(-2.80, 2.08, 0.05);
    bL1.add(posterWallLight);
    this.posterWallLight = posterWallLight;

    // 2nd Floor Balcony with iron railing
    const balconyL1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 4.5), concreteMatA);
    balconyL1.position.set(-3.5, 4.5, 2.0);
    bL1.add(balconyL1);

    const railingL1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 4.5), railingMat);
    railingL1.position.set(-2.95, 5.0, 2.0);
    bL1.add(railingL1);

    // Warm Lit Window
    const winL1 = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 1.4),
      new THREE.MeshBasicMaterial({ color: 0xffd166 })
    );
    winL1.position.set(-2.99, 5.2, 2.0);
    winL1.rotation.y = Math.PI / 2;
    bL1.add(winL1);

    // Rooftop Cylindrical Water Tank ("গাজী ট্যাংক")
    const tankL1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 1.5, 16),
      waterTankMat
    );
    tankL1.position.set(-5.5, 12.8, 1.5);
    bL1.add(tankL1);

    this.scene.add(bL1);

    // Building L2 (Further down alley)
    const bL2 = new THREE.Mesh(new THREE.BoxGeometry(8, 14, 12), concreteMatB);
    bL2.position.set(-7.5, 7, -10);
    bL2.castShadow = true;
    bL2.receiveShadow = true;
    this.scene.add(bL2);

    // --- RIGHT SIDE BUILDINGS ---

    // Building R1 (Commercial Storefront with Cyan Neon)
    const bR1 = new THREE.Group();
    const bR1Mesh = new THREE.Mesh(new THREE.BoxGeometry(7, 13, 11), concreteMatB);
    bR1Mesh.position.set(6.5, 6.5, 1);
    bR1Mesh.castShadow = true;
    bR1Mesh.receiveShadow = true;
    bR1.add(bR1Mesh);

    // Ground floor roll-down shutters
    for (let i = 0; i < 2; i++) {
      const shutter = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.6), shutterMat);
      shutter.position.set(3.01, 1.45, -0.5 + i * 3.0);
      shutter.rotation.y = -Math.PI / 2;
      bR1.add(shutter);
    }

    // Cyan/Magenta Electronics Sign ("নিউ ঢাকা ইলেকট্রনিক্স") — High-Visibility Backlit Sign
    const elecSignTex = ProceduralTextures.createBengaliSign(
      "নিউ ঢাকা ইলেকট্রনিক্স",
      "মোবাইল সার্ভিসিং ও ইলেকট্রিক পার্টস",
      "প্রোঃ আলহাজ্ব রফিকুল ইসলাম",
      "#08101e",
      "#e0f2fe",
      "#38bdf8",
      true
    );
    const elecSign = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 0.95),
      new THREE.MeshStandardMaterial({
        map: elecSignTex,
        emissiveMap: elecSignTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.9,
        roughness: 0.25,
      })
    );
    elecSign.position.set(2.98, 3.2, 1.0);
    elecSign.rotation.y = -Math.PI / 2;
    bR1.add(elecSign);

    // Weathered Street Wall Poster (Dhaka Cinema Poster) pasted on Building R1
    const cinemaPosterTex = ProceduralTextures.createStreetPoster(
      "ঈদ স্পেশাল রিলিজ",
      "স্বপ্নের নায়ক",
      "মনমাতানো অ্যাকশন ও রোমান্টিক ছায়াছবি\nদৈনিক ৪টি প্রদর্শনীর টিকিট বুকিং চলছে\nপরিবেশনায়: আনন্দ সিনেমা হল",
      "ঢাকা ফিল্মস পরিবেশনা",
      "#fef2f2",
      "#991b1b",
      "#1e3a8a"
    );
    const cinemaPoster = new THREE.Mesh(
      new THREE.PlaneGeometry(0.72, 1.02),
      new THREE.MeshStandardMaterial({
        map: cinemaPosterTex,
        emissiveMap: cinemaPosterTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.5,
        roughness: 0.8,
      })
    );
    cinemaPoster.position.set(2.97, 1.6, 3.6);
    cinemaPoster.rotation.y = -Math.PI / 2;
    bR1.add(cinemaPoster);

    // Balcony & Air Condition Outdoor Unit
    const balconyR1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 3.8), concreteMatB);
    balconyR1.position.set(3.5, 4.8, 1.0);
    bR1.add(balconyR1);

    const acUnit = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.5, 0.35),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
    );
    acUnit.position.set(2.85, 4.5, -1.2);
    bR1.add(acUnit);

    // Rooftop Water Tank
    const tankR1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 1.4, 16),
      waterTankMat
    );
    tankR1.position.set(5.5, 13.8, 0.5);
    bR1.add(tankR1);

    this.scene.add(bR1);

    // Building R2 (Background Corner Building)
    const bR2 = new THREE.Mesh(new THREE.BoxGeometry(8, 16, 14), concreteMatA);
    bR2.position.set(7.5, 8, -12);
    bR2.castShadow = true;
    bR2.receiveShadow = true;
    this.scene.add(bR2);

    // Distant Backdrop Silhouette Building down the street
    const backdropGeo = new THREE.BoxGeometry(16, 24, 6);
    const backdropMat = new THREE.MeshBasicMaterial({ color: 0x050811 });
    const backdropBuilding = new THREE.Mesh(backdropGeo, backdropMat);
    backdropBuilding.position.set(0, 10, -38);
    this.backdropBuilding = backdropBuilding;
    this.scene.add(backdropBuilding);
  }

  /**
   * Street Props: Roadside Tea Stall, Cycle Rickshaw, CNG, Utility Poles
   */
  private buildStreetProps(): void {
    const { props } = DHAKA_SCENE_CONFIG;

    // 1. Roadside Tea Stall ("চায়ের টং")
    const teaStall = DhakaProps.createTeaStall();
    teaStall.position.set(
      props.teaStallPosition[0],
      props.teaStallPosition[1],
      props.teaStallPosition[2]
    );
    teaStall.rotation.y = props.teaStallRotation;
    teaStall.traverse((child) => {
      if (child instanceof THREE.PointLight) {
        this.teaStallBulb = child;
      }
    });

    // 1b. Desi Tea Vendor NPC behind counter making tea ("চায়ের মামা")
    const teaVendor = StreetNPCs.createTeaVendor();
    teaVendor.group.position.set(0, 0, -0.15); // Directly behind the wooden counter table
    teaStall.add(teaVendor.group);
    this.animatedNPCs.push(teaVendor.update);

    this.scene.add(teaStall);

    // 1c. 3 Street Brawl NPCs fighting just beside the tea stall
    const fightNPCs = StreetNPCs.createStreetFightNPCs();
    fightNPCs.group.position.set(-1.45, 0, -1.15); // Curbside right next to tea stall bench
    fightNPCs.group.rotation.y = 0.35;
    this.scene.add(fightNPCs.group);
    this.animatedNPCs.push(fightNPCs.update);

    // 2. Traditional Cycle Rickshaw parked on curbside
    const rickshaw = DhakaProps.createRickshaw();
    rickshaw.position.set(
      props.rickshawPosition[0],
      props.rickshawPosition[1],
      props.rickshawPosition[2]
    );
    rickshaw.rotation.y = props.rickshawRotation;
    this.scene.add(rickshaw);

    // 3. Green CNG Auto-Rickshaw parked further down
    const cng = DhakaProps.createCNG();
    cng.position.set(
      props.cngPosition[0],
      props.cngPosition[1],
      props.cngPosition[2]
    );
    cng.rotation.y = props.cngRotation;
    this.scene.add(cng);

    // 4. Utility Poles with Streetlamps
    props.utilityPoles.forEach((pos) => {
      const pole = DhakaProps.createUtilityPole(7.2);
      pole.position.set(pos[0], pos[1], pos[2]);
      // Orient lamp arm inwards towards center street
      if (pos[0] < 0) {
        pole.rotation.y = 0; // Arm points +X
      } else {
        pole.rotation.y = Math.PI; // Arm points -X
      }
      pole.traverse((child) => {
        if (child instanceof THREE.PointLight) {
          this.streetLamps.push(child);
        }
      });
      this.scene.add(pole);
    });
  }

  /**
   * Overhead Catenary Sagging Electrical Cables ("ঝুলন্ত তার")
   */
  private buildOverheadWiring(): void {
    const { props } = DHAKA_SCENE_CONFIG;
    const poles = props.utilityPoles;

    if (poles.length >= 4) {
      // Span wires across street from Left Pole 0 to Right Pole 2
      const p0 = new THREE.Vector3(poles[0][0], 6.4, poles[0][2]);
      const p2 = new THREE.Vector3(poles[2][0], 6.4, poles[2][2]);
      this.scene.add(DhakaProps.createHangingWire(p0, p2, 0.65));

      // Second wire with different sag
      const p0b = new THREE.Vector3(poles[0][0] + 0.3, 5.7, poles[0][2]);
      const p2b = new THREE.Vector3(poles[2][0] - 0.3, 5.7, poles[2][2]);
      this.scene.add(DhakaProps.createHangingWire(p0b, p2b, 0.85));

      // Span wires down street from Left Pole 0 to Left Pole 1
      const p1 = new THREE.Vector3(poles[1][0], 6.4, poles[1][2]);
      this.scene.add(DhakaProps.createHangingWire(p0, p1, 0.7));

      // Span wires across street from Left Pole 1 to Right Pole 3
      const p3 = new THREE.Vector3(poles[3][0], 6.4, poles[3][2]);
      this.scene.add(DhakaProps.createHangingWire(p1, p3, 0.75));
    }
  }

  /**
   * Main render update loop for dynamic street NPCs and world animations
   */
  public update(delta: number, time: number): void {
    for (let i = 0; i < this.animatedNPCs.length; i++) {
      this.animatedNPCs[i](delta, time);
    }
  }

  /**
   * Dynamically toggles Day vs Night / Rainy / Foggy weather without context destruction
   */
  public setEnvironment(envId: string): void {
    const isDay = envId === "day-clear";
    const isRain = envId === "rainy-window";
    const isFog = envId === "foggy-night";

    if (isDay) {
      // 1. DAYTIME SETUP: Bright daylight sky, gentle atmospheric haze, and warm sunlight
      this.scene.background = new THREE.Color("#6ba3db");
      if (this.scene.fog) {
        (this.scene.fog as THREE.FogExp2).color.set("#94bce4");
        (this.scene.fog as THREE.FogExp2).density = 0.009;
      }
      if (this.skyMesh && this.skyMesh.material) {
        (this.skyMesh.material as THREE.MeshBasicMaterial).map = ProceduralTextures.createDaySkyTexture();
        (this.skyMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
      }

      // Daylight sky ambient fill
      this.ambientLight.color.setHex(0xdbeafe);
      this.ambientLight.intensity = 1.65;

      // Natural bright overhead sunlight casting shadows from above
      this.sunMoonLight.color.setHex(0xfffaec);
      this.sunMoonLight.intensity = 2.8;
      this.sunMoonLight.position.set(12, 38, 12);

      // Turn streetlamps and night fixtures off during daylight
      this.streetLamps.forEach((lamp) => {
        lamp.intensity = 0;
      });
      if (this.teaStallBulb) {
        this.teaStallBulb.intensity = 0.4;
      }
      if (this.posterWallLight) {
        this.posterWallLight.intensity = 0.2;
      }

      // Distant backdrop building blends into daylight haze
      if (this.backdropBuilding && this.backdropBuilding.material) {
        (this.backdropBuilding.material as THREE.MeshBasicMaterial).color.setHex(0x8fa8c6);
      }
    } else {
      // 2. NIGHTTIME SETUP (Current night setup)
      const fogDensity = isRain ? 0.038 : isFog ? 0.065 : 0.024;
      const fogColor = isRain ? "#070b12" : isFog ? "#0c1018" : "#080c14";

      this.scene.background = new THREE.Color(fogColor);
      if (this.scene.fog) {
        (this.scene.fog as THREE.FogExp2).color.set(fogColor);
        (this.scene.fog as THREE.FogExp2).density = fogDensity;
      }
      if (this.skyMesh && this.skyMesh.material) {
        (this.skyMesh.material as THREE.MeshBasicMaterial).map = ProceduralTextures.createNightSkyTexture();
        (this.skyMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
      }

      // Moonlight
      this.ambientLight.color.setHex(isRain ? 0x0f172a : isFog ? 0x1e2430 : 0x141c2c);
      this.ambientLight.intensity = isRain ? 0.65 : isFog ? 0.8 : 0.7;

      this.sunMoonLight.color.setHex(isRain ? 0x38557a : isFog ? 0x4a6080 : 0x5878b0);
      this.sunMoonLight.intensity = isRain ? 0.3 : isFog ? 0.25 : 0.4;
      this.sunMoonLight.position.set(-15, 30, -10);

      // Turn streetlights & lamps ON for the night
      this.streetLamps.forEach((lamp) => {
        lamp.intensity = isRain ? 2.8 : isFog ? 2.2 : 2.5;
      });
      if (this.teaStallBulb) {
        this.teaStallBulb.intensity = 3.2;
      }
      if (this.posterWallLight) {
        this.posterWallLight.intensity = 2.8;
      }

      // Distant backdrop silhouette
      if (this.backdropBuilding && this.backdropBuilding.material) {
        (this.backdropBuilding.material as THREE.MeshBasicMaterial).color.setHex(0x050811);
      }
    }
  }
}


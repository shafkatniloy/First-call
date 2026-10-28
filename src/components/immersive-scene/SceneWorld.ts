import * as THREE from "three";
import { ProceduralTextures } from "./ProceduralTextures";
import { DhakaProps } from "./DhakaProps";
import { DHAKA_SCENE_CONFIG } from "@/config/dhakaScene.config";

export class SceneWorld {
  public scene: THREE.Scene;
  private streetLamps: THREE.PointLight[] = [];

  constructor() {
    this.scene = new THREE.Scene();
    this.setupAtmosphere();
    this.buildGroundAndRoad();
    this.buildBuildings();
    this.buildStreetProps();
    this.buildOverheadWiring();
  }

  /**
   * Atmosphere: Background sky color & Nighttime Exponential Fog
   */
  private setupAtmosphere(): void {
    const { lighting } = DHAKA_SCENE_CONFIG;
    this.scene.background = new THREE.Color(lighting.fogColor);
    this.scene.fog = new THREE.FogExp2(lighting.fogColor, lighting.fogDensity);

    // 1. Ambient Night Fill Light
    const ambientLight = new THREE.AmbientLight(
      lighting.ambientColor,
      lighting.ambientIntensity
    );
    this.scene.add(ambientLight);

    // 2. Directional Cool Moonlight
    const moon = new THREE.DirectionalLight(
      lighting.moonColor,
      lighting.moonIntensity
    );
    moon.position.set(
      lighting.moonPosition[0],
      lighting.moonPosition[1],
      lighting.moonPosition[2]
    );
    moon.castShadow = true;
    moon.shadow.mapSize.width = 1024;
    moon.shadow.mapSize.height = 1024;
    moon.shadow.camera.near = 0.5;
    moon.shadow.camera.far = 60;
    this.scene.add(moon);
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
      shutter.position.set(-3.01, 1.45, 0.5 + i * 3.0);
      shutter.rotation.y = Math.PI / 2;
      bL1.add(shutter);
    }

    // Bengali Shop Sign ("মা ফার্মেসী")
    const pharmacySignTex = ProceduralTextures.createBengaliSign(
      "মা ফার্মেসী",
      "ঔষধ ও সার্জিক্যাল পণ্য সামগ্রী",
      "বিসমিল্লাহির রাহমানির রাহীম",
      "#064e3b",
      "#ffffff",
      "#34d399",
      true
    );
    const pharmacySign = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 0.9),
      new THREE.MeshStandardMaterial({
        map: pharmacySignTex,
        emissive: new THREE.Color(0x34d399),
        emissiveIntensity: 0.4,
        roughness: 0.3,
      })
    );
    pharmacySign.position.set(-2.98, 3.2, 2.0);
    pharmacySign.rotation.y = Math.PI / 2;
    bL1.add(pharmacySign);

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

    // Cyan/Magenta Electronics Sign ("নিউ ঢাকা ইলেকট্রনিক্স")
    const elecSignTex = ProceduralTextures.createBengaliSign(
      "নিউ ঢাকা",
      "ইলেকট্রনিক্স ও মোবাইল সার্ভিসিং",
      "প্রোঃ আলহাজ্ব রফিকুল ইসলাম",
      "#0f172a",
      "#38bdf8",
      "#f43f5e",
      true
    );
    const elecSign = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 0.95),
      new THREE.MeshStandardMaterial({
        map: elecSignTex,
        emissive: new THREE.Color(0x38bdf8),
        emissiveIntensity: 0.45,
        roughness: 0.3,
      })
    );
    elecSign.position.set(2.98, 3.2, 1.0);
    elecSign.rotation.y = -Math.PI / 2;
    bR1.add(elecSign);

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
    this.scene.add(teaStall);

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
}


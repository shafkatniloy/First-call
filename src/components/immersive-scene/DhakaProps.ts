import * as THREE from "three";
import { ProceduralTextures } from "./ProceduralTextures";

export class DhakaProps {
  /**
   * Roadside Dhaka Tea Stall ("চায়ের টং")
   */
  public static createTeaStall(): THREE.Group {
    const group = new THREE.Group();
    group.name = "TeaStall";

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      roughness: 0.9,
    });
    const tinRoofMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createCorrugatedTin(),
      roughness: 0.7,
      metalness: 0.4,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.85,
      roughness: 0.25,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      transmission: 0.8,
    });

    // 1. Four Wooden Posts
    const postGeo = new THREE.BoxGeometry(0.12, 2.5, 0.12);
    const postPositions = [
      [-1.1, 1.25, -0.9],
      [1.1, 1.25, -0.9],
      [-1.1, 1.15, 0.9],
      [1.1, 1.15, 0.9],
    ];
    postPositions.forEach((pos) => {
      const post = new THREE.Mesh(postGeo, woodMat);
      post.position.set(pos[0], pos[1], pos[2]);
      post.castShadow = true;
      group.add(post);
    });

    // 2. Slanted Corrugated Tin Roof
    const roofGeo = new THREE.BoxGeometry(2.6, 0.08, 2.2);
    const roof = new THREE.Mesh(roofGeo, tinRoofMat);
    roof.position.set(0, 2.45, 0);
    roof.rotation.x = 0.08; // Gentle slant forward
    roof.castShadow = true;
    group.add(roof);

    // 3. Wooden Counter Table
    const counterGeo = new THREE.BoxGeometry(2.1, 0.85, 0.75);
    const counter = new THREE.Mesh(counterGeo, woodMat);
    counter.position.set(0, 0.425, 0.4);
    counter.castShadow = true;
    group.add(counter);

    // 4. Aluminum Tea Kettle ("কেটলি")
    const kettleGroup = new THREE.Group();
    const kettleBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.32, 16),
      metalMat
    );
    kettleBody.position.y = 0.16;
    kettleGroup.add(kettleBody);

    const kettleLid = new THREE.Mesh(
      new THREE.ConeGeometry(0.16, 0.08, 16),
      metalMat
    );
    kettleLid.position.y = 0.36;
    kettleGroup.add(kettleLid);

    // Kettle Spout
    const spout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.05, 0.2, 8),
      metalMat
    );
    spout.position.set(0.18, 0.22, 0);
    spout.rotation.z = -0.7;
    kettleGroup.add(spout);

    kettleGroup.position.set(-0.55, 0.85, 0.4);
    group.add(kettleGroup);

    // 5. Biscuit Jars on Counter ("কাচের বয়াম")
    for (let i = 0; i < 3; i++) {
      const jar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.26, 12),
        glassMat
      );
      jar.position.set(0.1 + i * 0.26, 0.98, 0.4);

      // Biscuit contents inside jar
      const biscuits = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.18, 8),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 })
      );
      biscuits.position.set(0.1 + i * 0.26, 0.94, 0.4);

      group.add(jar);
      group.add(biscuits);
    }

    // 6. Wooden Bench Beside Stall ("টং এর বেঞ্চ")
    const benchGeo = new THREE.BoxGeometry(1.6, 0.08, 0.32);
    const bench = new THREE.Mesh(benchGeo, woodMat);
    bench.position.set(0, 0.4, 1.25);
    bench.castShadow = true;
    group.add(bench);

    const legGeo = new THREE.BoxGeometry(0.08, 0.4, 0.08);
    const legPositions = [
      [-0.7, 0.2, 1.25],
      [0.7, 0.2, 1.25],
    ];
    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(pos[0], pos[1], pos[2]);
      group.add(leg);
    });

    // 7. Bengali Signboard Above Stall ("হাবিব ভাই এর চা এর দোকান")
    const signTex = ProceduralTextures.createBengaliSign(
      "হাবিব ভাই এর চা এর দোকান",
      "স্পেশাল মালাই চা ও টোস্ট বিস্কুট",
      "বিসমিল্লাহির রাহমানির রাহীম",
      "#181206",
      "#fffbeb",
      "#f59e0b",
      true
    );
    const signGeo = new THREE.PlaneGeometry(2.35, 0.74);
    const signMat = new THREE.MeshStandardMaterial({
      map: signTex,
      emissiveMap: signTex,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.92,
      roughness: 0.25,
    });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 2.12, 0.92);
    group.add(sign);

    // 7b. Street Poster pasted on side of tea stall counter
    const stallPosterTex = ProceduralTextures.createStreetPoster(
      "বিশেষ ঘোষণা",
      "মালাই চা",
      "খাঁটি গরুর দুধের স্পেশাল মালাই\nপ্রতি কাপ মাত্র ১০ টাকা",
      "হাবিব টি স্টল • ঢাকা",
      "#fef9c3",
      "#b91c1c",
      "#1e1b4b"
    );
    const stallPoster = new THREE.Mesh(
      new THREE.PlaneGeometry(0.48, 0.68),
      new THREE.MeshStandardMaterial({
        map: stallPosterTex,
        emissiveMap: stallPosterTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.45,
        roughness: 0.85,
      })
    );
    stallPoster.position.set(-0.85, 0.52, 0.76);
    stallPoster.rotation.y = -Math.PI / 2;
    group.add(stallPoster);

    // 8. Hanging Bare Tungsten Bulb with Warm Point Light
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xfff0aa })
    );
    bulb.position.set(0, 2.05, 0.3);
    group.add(bulb);

    const bulbLight = new THREE.PointLight(0xffaa33, 3.2, 7);
    bulbLight.position.set(0, 2.0, 0.3);
    bulbLight.castShadow = true;
    group.add(bulbLight);

    return group;
  }

  /**
   * Traditional Dhaka Cycle Rickshaw
   */
  public static createRickshaw(): THREE.Group {
    const rickshaw = new THREE.Group();
    rickshaw.name = "CycleRickshaw";

    const metalFrameMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Rich navy blue steel frame
      metalness: 0.7,
      roughness: 0.3,
    });
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.9,
    });
    const hoodMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createRickshawArt(),
      roughness: 0.5,
    });
    const seatMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Red vinyl cushion
      roughness: 0.6,
    });

    // Wheels (1 Front, 2 Rear)
    const wheelGeo = new THREE.TorusGeometry(0.38, 0.045, 8, 24);

    // Front Wheel
    const frontWheel = new THREE.Mesh(wheelGeo, tireMat);
    frontWheel.position.set(0, 0.38, 1.4);
    frontWheel.rotation.y = Math.PI / 2;
    rickshaw.add(frontWheel);

    // Rear Left & Right Wheels
    const rearWheelL = new THREE.Mesh(wheelGeo, tireMat);
    rearWheelL.position.set(-0.55, 0.38, -0.4);
    rearWheelL.rotation.y = Math.PI / 2;
    rickshaw.add(rearWheelL);

    const rearWheelR = new THREE.Mesh(wheelGeo, tireMat);
    rearWheelR.position.set(0.55, 0.38, -0.4);
    rearWheelR.rotation.y = Math.PI / 2;
    rickshaw.add(rearWheelR);

    // Wheel hubs & spokes ring
    const axle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 1.15, 8),
      metalFrameMat
    );
    axle.position.set(0, 0.38, -0.4);
    axle.rotation.z = Math.PI / 2;
    rickshaw.add(axle);

    // Main Bicycle Frame Tubes
    const frameTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 1.8, 8),
      metalFrameMat
    );
    frameTube.position.set(0, 0.65, 0.5);
    frameTube.rotation.x = 0.5;
    rickshaw.add(frameTube);

    // Handlebars
    const handlebar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8),
      metalFrameMat
    );
    handlebar.position.set(0, 1.05, 1.15);
    handlebar.rotation.z = Math.PI / 2;
    rickshaw.add(handlebar);

    // Driver Saddle
    const saddle = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.22, 4),
      tireMat
    );
    saddle.position.set(0, 0.85, 0.5);
    saddle.rotation.x = -Math.PI / 2;
    rickshaw.add(saddle);

    // Passenger Carriage Box
    const carriageBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.35, 0.85),
      metalFrameMat
    );
    carriageBox.position.set(0, 0.55, -0.4);
    rickshaw.add(carriageBox);

    // Passenger Seat Cushion
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.12, 0.4),
      seatMat
    );
    seat.position.set(0, 0.75, -0.35);
    rickshaw.add(seat);

    // Backrest
    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.45, 0.08),
      seatMat
    );
    backrest.position.set(0, 1.0, -0.58);
    rickshaw.add(backrest);

    // Folding Decorative Hood Canopy
    const hood = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.52, 0.9, 16, 1, false, 0, Math.PI),
      hoodMat
    );
    hood.position.set(0, 1.25, -0.4);
    hood.rotation.z = Math.PI / 2;
    hood.rotation.y = Math.PI / 2;
    rickshaw.add(hood);

    // Rickshaw Headlight Bell
    const bellLight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.04, 0.08, 12),
      metalFrameMat
    );
    bellLight.position.set(0, 0.88, 1.45);
    bellLight.rotation.x = Math.PI / 2;
    rickshaw.add(bellLight);

    return rickshaw;
  }

  /**
   * Green CNG Auto-Rickshaw ("সিএনজি")
   */
  public static createCNG(): THREE.Group {
    const cng = new THREE.Group();
    cng.name = "CNGAutoRickshaw";

    const greenBodyMat = new THREE.MeshStandardMaterial({
      color: 0x059669, // Dhaka CNG Emerald Green
      roughness: 0.4,
      metalness: 0.3,
    });
    const yellowRoofMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Yellow canvas canopy
      roughness: 0.8,
    });
    const blackRubberMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.9,
    });
    const wireMeshMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.7,
      wireframe: true,
    });

    // 3 Wheels (1 Front, 2 Rear)
    const cngWheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 16);

    const frontWheel = new THREE.Mesh(cngWheelGeo, blackRubberMat);
    frontWheel.position.set(0, 0.24, 1.2);
    frontWheel.rotation.z = Math.PI / 2;
    cng.add(frontWheel);

    const rearWheelL = new THREE.Mesh(cngWheelGeo, blackRubberMat);
    rearWheelL.position.set(-0.62, 0.24, -0.6);
    rearWheelL.rotation.z = Math.PI / 2;
    cng.add(rearWheelL);

    const rearWheelR = new THREE.Mesh(cngWheelGeo, blackRubberMat);
    rearWheelR.position.set(0.62, 0.24, -0.6);
    rearWheelR.rotation.z = Math.PI / 2;
    cng.add(rearWheelR);

    // Lower Cabin Chassis
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(1.25, 0.45, 2.3),
      greenBodyMat
    );
    chassis.position.set(0, 0.45, 0.2);
    chassis.castShadow = true;
    cng.add(chassis);

    // Front Nose / Cowl
    const nose = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.55, 0.65, 8),
      greenBodyMat
    );
    nose.position.set(0, 0.65, 1.1);
    nose.rotation.x = -0.3;
    cng.add(nose);

    // Single Round Headlight
    const headlight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.06, 12),
      new THREE.MeshBasicMaterial({ color: 0xfff3c4 })
    );
    headlight.position.set(0, 0.65, 1.44);
    headlight.rotation.x = Math.PI / 2;
    cng.add(headlight);

    // Yellow Canvas Canopy / Roof
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(1.22, 0.12, 1.7),
      yellowRoofMat
    );
    roof.position.set(0, 1.55, -0.1);
    cng.add(roof);

    // Side Protective Wire Grilles
    const leftGrille = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.75, 8, 4),
      wireMeshMat
    );
    leftGrille.position.set(-0.61, 1.05, -0.1);
    leftGrille.rotation.y = Math.PI / 2;
    cng.add(leftGrille);

    const rightGrille = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.75, 8, 4),
      wireMeshMat
    );
    rightGrille.position.set(0.61, 1.05, -0.1);
    rightGrille.rotation.y = -Math.PI / 2;
    cng.add(rightGrille);

    return cng;
  }

  /**
   * Concrete Utility Pole with Sodium Vapor Streetlamp & Hanging Wires
   */
  public static createUtilityPole(height: number = 7.5): THREE.Group {
    const poleGroup = new THREE.Group();
    poleGroup.name = "UtilityPole";

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.9,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.6,
      roughness: 0.4,
    });

    // Vertical Concrete Post
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.2, height, 12),
      concreteMat
    );
    pole.position.y = height / 2;
    pole.castShadow = true;
    poleGroup.add(pole);

    // Horizontal Crossarms for Electrical Cables
    for (let i = 0; i < 2; i++) {
      const crossarm = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.08, 0.08),
        metalMat
      );
      crossarm.position.set(0, height - 0.8 - i * 0.7, 0);
      poleGroup.add(crossarm);

      // Insulator caps
      [-0.65, -0.25, 0.25, 0.65].forEach((xPos) => {
        const insulator = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.035, 0.1, 8),
          new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 })
        );
        insulator.position.set(xPos, height - 0.73 - i * 0.7, 0);
        poleGroup.add(insulator);
      });
    }

    // Streetlamp Curved Arm extending towards the street
    const lampArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8),
      metalMat
    );
    lampArm.position.set(0.6, height - 0.3, 0);
    lampArm.rotation.z = -Math.PI / 3;
    poleGroup.add(lampArm);

    // Lamp Fixture
    const lampFixture = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.25, 12),
      metalMat
    );
    lampFixture.position.set(1.2, height - 0.65, 0);
    poleGroup.add(lampFixture);

    // Emissive Light Bulb
    const lampBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffaa44 })
    );
    lampBulb.position.set(1.2, height - 0.75, 0);
    poleGroup.add(lampBulb);

    // Downward Point Light
    const streetLight = new THREE.PointLight(0xff9933, 2.5, 15);
    streetLight.position.set(1.2, height - 0.8, 0);
    streetLight.castShadow = true;
    poleGroup.add(streetLight);

    return poleGroup;
  }

  /**
   * Hanging Catenary Overhead Electrical Cable
   */
  public static createHangingWire(
    start: THREE.Vector3,
    end: THREE.Vector3,
    sag: number = 0.5
  ): THREE.Line {
    const mid = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5);
    mid.y -= sag;

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(24);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x111827,
      linewidth: 1.5,
    });

    return new THREE.Line(geometry, material);
  }

  /**
   * Roadside Distressed Brick Boundary Wall with the Authentic Election Poster pasted at eye level
   */
  public static createRoadsidePosterWall(
    width: number = 1.6,
    height: number = 2.3,
    depth: number = 0.24
  ): THREE.Group {
    const wallGroup = new THREE.Group();
    wallGroup.name = "RoadsidePosterWall";

    // 1. Brick Wall Body
    const brickTex = ProceduralTextures.createBrickWallTexture();
    brickTex.repeat.set(1.5, 2.0);
    const brickMat = new THREE.MeshStandardMaterial({
      map: brickTex,
      roughness: 0.88,
      metalness: 0.05,
    });
    const wallBody = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      brickMat
    );
    wallBody.position.y = height / 2;
    wallBody.castShadow = true;
    wallBody.receiveShadow = true;
    wallGroup.add(wallBody);

    // 2. Concrete Coping Slab on Top
    const copingMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Weathered grey slate
      roughness: 0.9,
    });
    const coping = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.1, 0.09, depth + 0.08),
      copingMat
    );
    coping.position.y = height + 0.045;
    coping.castShadow = true;
    wallGroup.add(coping);

    // 3. Concrete Curb Base
    const curb = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.06, 0.14, depth + 0.06),
      copingMat
    );
    curb.position.y = 0.07;
    curb.receiveShadow = true;
    wallGroup.add(curb);

    // 4. Authentic Election Poster ("কলা মার্কা" / আমানত উল্লাহ আমান)
    const textureLoader = new THREE.TextureLoader();
    const posterTex = textureLoader.load("/assets/election_poster.jpg", () => {
      posterTex.colorSpace = THREE.SRGBColorSpace;
      posterMat.needsUpdate = true;
    });

    // 764 x 1024 aspect ratio: 0.746 (0.84m wide x 1.12m tall)
    const posterGeo = new THREE.PlaneGeometry(0.84, 1.12);
    const posterMat = new THREE.MeshStandardMaterial({
      map: posterTex,
      emissiveMap: posterTex,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.52, // Enhanced self-illumination for night legibility
      roughness: 0.7,
      metalness: 0.02,
    });
    const poster = new THREE.Mesh(posterGeo, posterMat);
    poster.position.set(0, 1.25, depth / 2 + 0.008);
    wallGroup.add(poster);

    // 5. Subtle wall-mounted brass light fixture above poster
    const lampFixture = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.08, 0.08, 10),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 })
    );
    lampFixture.position.set(0, height - 0.2, depth / 2 + 0.12);
    lampFixture.rotation.x = Math.PI / 4;
    wallGroup.add(lampFixture);

    const wallLight = new THREE.PointLight(0xffb040, 2.2, 4.0);
    wallLight.position.set(0, height - 0.22, depth / 2 + 0.18);
    wallGroup.add(wallLight);

    return wallGroup;
  }
}


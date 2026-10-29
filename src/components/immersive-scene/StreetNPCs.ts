import * as THREE from "three";
import { ProceduralTextures } from "./ProceduralTextures";

/**
 * Procedural Desi Human NPC Builder with articulated joints for dynamic street animations
 */
export class StreetNPCs {
  /**
   * 1. Desi Tea Vendor NPC ("চায়ের মামা" / Chaiwala)
   * Positioned behind the counter inside the tea stall, making tea with high-pour kettle animation
   */
  public static createTeaVendor(): {
    group: THREE.Group;
    update: (delta: number, time: number) => void;
  } {
    const group = new THREE.Group();
    group.name = "DesiTeaVendor";

    const skinMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createDesiFaceTexture("#9d5f3d", true),
      roughness: 0.65,
    });
    const bareSkinMat = new THREE.MeshStandardMaterial({
      color: 0x9d5f3d,
      roughness: 0.65,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x171412,
      roughness: 0.9,
    });
    const ganjiMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // White ribbed cotton vest / sando ganji
      roughness: 0.85,
    });
    const lungiMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createLungiTexture("#1e3a8a", "#0284c7"),
      roughness: 0.8,
    });
    const gamchaMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createGamchaTexture(),
      roughness: 0.85,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.85,
      roughness: 0.25,
    });
    const teaLiquidMat = new THREE.MeshBasicMaterial({
      color: 0xb45309, // Rich golden milk tea
      transparent: true,
      opacity: 0.85,
    });

    // 1. Lower Body — Lungi draped from waist to ankles
    const lungi = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.22, 0.78, 16),
      lungiMat
    );
    lungi.position.y = 0.39;
    lungi.castShadow = true;
    group.add(lungi);

    // Bare feet
    for (let i = -1; i <= 1; i += 2) {
      const foot = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.05, 0.16),
        bareSkinMat
      );
      foot.position.set(i * 0.09, 0.025, 0.03);
      group.add(foot);
    }

    // 2. Torso (Vest / Sando Ganji)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.78, 0);
    group.add(torsoGroup);

    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.16, 0.44, 16),
      ganjiMat
    );
    torso.position.y = 0.22;
    torso.castShadow = true;
    torsoGroup.add(torso);

    // Traditional red checkered gamcha draped over left shoulder
    const gamcha = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.48, 0.14),
      gamchaMat
    );
    gamcha.position.set(-0.13, 0.22, 0.02);
    gamcha.rotation.z = -0.15;
    torsoGroup.add(gamcha);

    // 3. Neck & Head with Moustache
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.075, 0.1, 12),
      bareSkinMat
    );
    neck.position.y = 0.46;
    torsoGroup.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.58;
    torsoGroup.add(headGroup);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.115, 16, 16),
      skinMat
    );
    head.rotation.y = -Math.PI / 2; // Face forward
    headGroup.add(head);

    // Dark hair & sideburns
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      hairMat
    );
    hair.position.y = 0.02;
    headGroup.add(hair);

    // 4. Left Arm (Holds tea cup beneath the stream)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.19, 0.38, 0);
    torsoGroup.add(leftArmGroup);

    const leftUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.042, 0.22, 10),
      bareSkinMat
    );
    leftUpperArm.position.set(0, -0.1, 0.04);
    leftUpperArm.rotation.x = 0.5;
    leftArmGroup.add(leftUpperArm);

    const leftForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.035, 0.24, 10),
      bareSkinMat
    );
    leftForearm.position.set(0.08, -0.16, 0.22);
    leftForearm.rotation.set(-0.9, 0.2, -0.5);
    leftArmGroup.add(leftForearm);

    // Tea Glass ("কাচের কাপ") held in left hand
    const teaGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.035, 0.09, 12),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
      })
    );
    teaGlass.position.set(0.14, -0.18, 0.34);
    leftArmGroup.add(teaGlass);

    // Tea in glass
    const teaInGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.032, 0.07, 10),
      teaLiquidMat
    );
    teaInGlass.position.set(0.14, -0.18, 0.34);
    leftArmGroup.add(teaInGlass);

    // 5. Right Arm (Articulated shoulder lifting tea pot high to pour!)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.19, 0.38, 0);
    torsoGroup.add(rightArmGroup);

    const rightUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.042, 0.22, 10),
      bareSkinMat
    );
    rightUpperArm.position.y = -0.1;
    rightArmGroup.add(rightUpperArm);

    const rightForearmGroup = new THREE.Group();
    rightForearmGroup.position.set(0, -0.2, 0);
    rightArmGroup.add(rightForearmGroup);

    const rightForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.035, 0.22, 10),
      bareSkinMat
    );
    rightForearm.position.y = -0.1;
    rightForearmGroup.add(rightForearm);

    // Stainless Steel Pouring Pot / Kettle held in right hand
    const pourPot = new THREE.Group();
    pourPot.position.set(0, -0.22, 0.08);
    rightForearmGroup.add(pourPot);

    const potBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.085, 0.16, 12),
      metalMat
    );
    pourPot.add(potBody);

    const potSpout = new THREE.Mesh(
      new THREE.ConeGeometry(0.025, 0.1, 8),
      metalMat
    );
    potSpout.position.set(0, -0.06, 0.08);
    potSpout.rotation.x = Math.PI / 3;
    pourPot.add(potSpout);

    // 6. Dynamic Milk Tea Stream (Pours from pot down into cup)
    const teaStreamGeo = new THREE.CylinderGeometry(0.007, 0.005, 0.35, 8);
    const teaStream = new THREE.Mesh(teaStreamGeo, teaLiquidMat);
    teaStream.position.set(0.12, 0.82, 0.36);
    group.add(teaStream);

    // 7. Rising Hot Steam Particle Sprites
    const steamGroup = new THREE.Group();
    group.add(steamGroup);
    const steamGeo = new THREE.SphereGeometry(0.02, 6, 6);
    const steamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const steamParticles: { mesh: THREE.Mesh; seed: number; speed: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(steamGeo, steamMat);
      p.position.set(0.12 + (Math.random() - 0.5) * 0.06, 0.85 + Math.random() * 0.3, 0.36 + (Math.random() - 0.5) * 0.06);
      steamGroup.add(p);
      steamParticles.push({ mesh: p, seed: Math.random() * 10, speed: 0.2 + Math.random() * 0.15 });
    }

    // Animation function
    const update = (_delta: number, time: number) => {
      // Pouring arm animation — Raises and lowers in classic Dhaka high-pour rhythm
      const cycle = Math.sin(time * 1.8);
      rightArmGroup.rotation.x = -0.6 + cycle * 0.35;
      rightArmGroup.rotation.z = -0.3 + cycle * 0.15;
      rightForearmGroup.rotation.x = -0.7 - cycle * 0.25;

      // Subtle torso breathing and head watching the pour
      torsoGroup.rotation.y = Math.sin(time * 0.9) * 0.06;
      headGroup.rotation.x = 0.25 + Math.sin(time * 1.8) * 0.08;

      // Tea stream stretches and animates
      const streamScaleY = 0.85 + cycle * 0.35;
      teaStream.scale.set(1, streamScaleY, 1);
      teaStream.position.y = 0.78 + cycle * 0.06;
      teaStream.rotation.z = Math.sin(time * 1.8) * 0.08;

      // Animate rising steam particles
      steamParticles.forEach((sp) => {
        sp.mesh.position.y += sp.speed * _delta;
        sp.mesh.position.x += Math.sin(time * 2 + sp.seed) * 0.001;
        if (sp.mesh.position.y > 1.35) {
          sp.mesh.position.y = 0.86;
          sp.mesh.position.x = 0.12 + (Math.random() - 0.5) * 0.04;
        }
      });
    };

    return { group, update };
  }

  /**
   * 2. Street Fight NPCs — 3 Animated Characters in an intense retro Dhaka street brawl
   */
  public static createStreetFightNPCs(): {
    group: THREE.Group;
    update: (delta: number, time: number) => void;
  } {
    const group = new THREE.Group();
    group.name = "StreetFightScene";

    // Common skin & hair materials
    const skinMat1 = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createDesiFaceTexture("#8c5030", false),
      roughness: 0.7,
    });
    const skinMat2 = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createDesiFaceTexture("#9d5f3d", true),
      roughness: 0.7,
    });
    const skinMat3 = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createDesiFaceTexture("#b2744f", true),
      roughness: 0.7,
    });
    const bareSkinMat = new THREE.MeshStandardMaterial({
      color: 0x945a3a,
      roughness: 0.7,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.9,
    });

    // Clothing materials
    const mustardShirtMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Fighter 1: Mustard yellow t-shirt
      roughness: 0.85,
    });
    const blueJeansMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Dark denim jeans
      roughness: 0.9,
    });
    const plaidShirtMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createShirtTexture("#b91c1c", "#18181b"), // Fighter 2: Red checked shirt
      roughness: 0.85,
    });
    const khakiPantsMat = new THREE.MeshStandardMaterial({
      color: 0x78716c, // Khaki trousers
      roughness: 0.85,
    });
    const panjabiMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Fighter 3 (Intervener): Crisp White Panjabi
      roughness: 0.85,
    });
    const darkPantsMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.9,
    });

    // ==========================================
    // FIGHTER 1: The Aggressor (Punching & Jabbing)
    // ==========================================
    const f1 = new THREE.Group();
    f1.position.set(-0.55, 0, 0);
    group.add(f1);

    // Legs
    const f1LegL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.85, 12), blueJeansMat);
    f1LegL.position.set(-0.12, 0.42, 0.15);
    f1LegL.rotation.x = -0.3; // Stride forward
    f1.add(f1LegL);

    const f1LegR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.85, 12), blueJeansMat);
    f1LegR.position.set(0.12, 0.42, -0.15);
    f1LegR.rotation.x = 0.25; // Back leg braced
    f1.add(f1LegR);

    // Torso
    const f1TorsoGroup = new THREE.Group();
    f1TorsoGroup.position.set(0, 0.82, 0);
    f1.add(f1TorsoGroup);

    const f1Torso = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.16, 0.48, 14), mustardShirtMat);
    f1Torso.position.y = 0.24;
    f1Torso.castShadow = true;
    f1TorsoGroup.add(f1Torso);

    // Head
    const f1HeadGroup = new THREE.Group();
    f1HeadGroup.position.y = 0.58;
    f1TorsoGroup.add(f1HeadGroup);

    const f1Head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), skinMat1);
    f1HeadGroup.add(f1Head);
    const f1Hair = new THREE.Mesh(new THREE.SphereGeometry(0.115, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
    f1HeadGroup.add(f1Hair);

    // Left Guard Arm
    const f1ArmL = new THREE.Group();
    f1ArmL.position.set(-0.2, 0.42, 0);
    f1TorsoGroup.add(f1ArmL);
    const f1UpperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.24, 8), mustardShirtMat);
    f1UpperArmL.position.set(0, -0.1, 0.08);
    f1UpperArmL.rotation.set(-0.6, 0.3, -0.4);
    f1ArmL.add(f1UpperArmL);
    const f1FistL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), bareSkinMat);
    f1FistL.position.set(0.06, -0.18, 0.26);
    f1ArmL.add(f1FistL);

    // Right Punching Arm (Articulated forward punch!)
    const f1PunchArm = new THREE.Group();
    f1PunchArm.position.set(0.2, 0.42, 0);
    f1TorsoGroup.add(f1PunchArm);
    const f1UpperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.25, 8), mustardShirtMat);
    f1UpperArmR.position.y = -0.12;
    f1PunchArm.add(f1UpperArmR);
    const f1ForearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.038, 0.25, 8), bareSkinMat);
    f1ForearmR.position.set(0, -0.22, 0.12);
    f1ForearmR.rotation.x = -1.2;
    f1PunchArm.add(f1ForearmR);
    const f1FistR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), bareSkinMat);
    f1FistR.position.set(0, -0.25, 0.28);
    f1PunchArm.add(f1FistR);

    // ==========================================
    // FIGHTER 2: The Brawler (Grappling & Dodging)
    // ==========================================
    const f2 = new THREE.Group();
    f2.position.set(0.45, 0, 0);
    f2.rotation.y = Math.PI; // Face Fighter 1
    group.add(f2);

    // Legs
    const f2LegL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.85, 12), khakiPantsMat);
    f2LegL.position.set(-0.12, 0.42, 0.12);
    f2LegL.rotation.x = -0.25;
    f2.add(f2LegL);

    const f2LegR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.85, 12), khakiPantsMat);
    f2LegR.position.set(0.12, 0.42, -0.12);
    f2LegR.rotation.x = 0.25;
    f2.add(f2LegR);

    // Torso
    const f2TorsoGroup = new THREE.Group();
    f2TorsoGroup.position.set(0, 0.82, 0);
    f2.add(f2TorsoGroup);

    const f2Torso = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.16, 0.48, 14), plaidShirtMat);
    f2Torso.position.y = 0.24;
    f2Torso.castShadow = true;
    f2TorsoGroup.add(f2Torso);

    // Head
    const f2HeadGroup = new THREE.Group();
    f2HeadGroup.position.y = 0.58;
    f2TorsoGroup.add(f2HeadGroup);

    const f2Head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), skinMat2);
    f2HeadGroup.add(f2Head);
    const f2Hair = new THREE.Mesh(new THREE.SphereGeometry(0.115, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
    f2HeadGroup.add(f2Hair);

    // Both Arms Grappling forward
    const f2ArmL = new THREE.Group();
    f2ArmL.position.set(-0.2, 0.42, 0);
    f2TorsoGroup.add(f2ArmL);
    const f2ForearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.038, 0.35, 8), bareSkinMat);
    f2ForearmL.position.set(0.08, -0.1, 0.2);
    f2ForearmL.rotation.set(-1.1, -0.3, 0.4);
    f2ArmL.add(f2ForearmL);

    const f2ArmR = new THREE.Group();
    f2ArmR.position.set(0.2, 0.42, 0);
    f2TorsoGroup.add(f2ArmR);
    const f2ForearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.038, 0.35, 8), bareSkinMat);
    f2ForearmR.position.set(-0.08, -0.1, 0.2);
    f2ForearmR.rotation.set(-1.1, 0.3, -0.4);
    f2ArmR.add(f2ForearmR);

    // ==========================================
    // FIGHTER 3: The Intervener ("আরে ভাই থামেন!" Bystander)
    // ==========================================
    const f3 = new THREE.Group();
    f3.position.set(-0.05, 0, -0.48); // Flanking between them
    f3.rotation.y = 0.4;
    group.add(f3);

    // Lower Panjabi Skirt & Legs
    const f3PanjabiSkirt = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.55, 14), panjabiMat);
    f3PanjabiSkirt.position.y = 0.55;
    f3.add(f3PanjabiSkirt);

    const f3LegL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.5, 10), darkPantsMat);
    f3LegL.position.set(-0.09, 0.25, 0);
    f3.add(f3LegL);
    const f3LegR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.5, 10), darkPantsMat);
    f3LegR.position.set(0.09, 0.25, 0);
    f3.add(f3LegR);

    // Torso (White Panjabi)
    const f3TorsoGroup = new THREE.Group();
    f3TorsoGroup.position.set(0, 0.82, 0);
    f3.add(f3TorsoGroup);

    const f3Torso = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.5, 14), panjabiMat);
    f3Torso.position.y = 0.25;
    f3TorsoGroup.add(f3Torso);

    // Head
    const f3HeadGroup = new THREE.Group();
    f3HeadGroup.position.y = 0.59;
    f3TorsoGroup.add(f3HeadGroup);
    const f3Head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), skinMat3);
    f3HeadGroup.add(f3Head);
    const f3Hair = new THREE.Mesh(new THREE.SphereGeometry(0.115, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
    f3HeadGroup.add(f3Hair);

    // Outstretched Arms trying to push them apart!
    const f3ArmL = new THREE.Group();
    f3ArmL.position.set(-0.2, 0.4, 0);
    f3TorsoGroup.add(f3ArmL);
    const f3ArmMeshL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.42, 8), panjabiMat);
    f3ArmMeshL.position.set(-0.16, -0.05, 0.18);
    f3ArmMeshL.rotation.set(-1.2, 0.7, -0.8); // Reaching out towards Fighter 1
    f3ArmL.add(f3ArmMeshL);

    const f3ArmR = new THREE.Group();
    f3ArmR.position.set(0.2, 0.4, 0);
    f3TorsoGroup.add(f3ArmR);
    const f3ArmMeshR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.42, 8), panjabiMat);
    f3ArmMeshR.position.set(0.16, -0.05, 0.18);
    f3ArmMeshR.rotation.set(-1.2, -0.7, 0.8); // Reaching out towards Fighter 2
    f3ArmR.add(f3ArmMeshR);

    // ==========================================
    // Street Brawl Animation Loop
    // ==========================================
    const update = (_delta: number, time: number) => {
      const brawlTempo = time * 3.8;

      // Fighter 1: Fast rhythmic jabs & aggressive lunges
      const punchCycle = Math.sin(brawlTempo);
      f1PunchArm.rotation.x = -0.4 - Math.max(0, punchCycle) * 0.95; // Sharp extension
      f1PunchArm.rotation.y = Math.sin(brawlTempo) * 0.2;
      f1TorsoGroup.rotation.y = 0.35 + punchCycle * 0.3; // Torso rotates into punch
      f1.position.z = Math.sin(brawlTempo * 0.5) * 0.12; // Shuffling back and forth

      // Fighter 2: Ducking, dodging, and reacting to punches
      const dodgeCycle = Math.cos(brawlTempo);
      f2HeadGroup.rotation.x = -0.2 + Math.max(0, dodgeCycle) * 0.45; // Ducking head
      f2HeadGroup.rotation.y = -Math.sin(brawlTempo) * 0.3;
      f2TorsoGroup.position.y = 0.82 - Math.max(0, dodgeCycle) * 0.08; // Crouching
      f2TorsoGroup.rotation.y = -Math.sin(brawlTempo) * 0.35;
      f2ArmL.rotation.x = Math.sin(brawlTempo * 1.2) * 0.3;
      f2ArmR.rotation.x = -Math.sin(brawlTempo * 1.2) * 0.3;

      // Fighter 3: Frantic bystander trying to break them apart ("থামা ভাই!")
      f3TorsoGroup.rotation.y = Math.sin(time * 2.5) * 0.35; // Looking back and forth frantically
      f3HeadGroup.rotation.y = Math.cos(time * 3.5) * 0.4;
      f3ArmL.rotation.y = Math.sin(time * 4) * 0.25; // Pushing Fighter 1
      f3ArmR.rotation.y = -Math.sin(time * 4) * 0.25; // Pushing Fighter 2
      f3.position.x = -0.05 + Math.sin(time * 1.5) * 0.06;
    };

    return { group, update };
  }
}


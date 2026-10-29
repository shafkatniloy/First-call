# Graphics direction: retro Dhaka 3D environment

This document defines the artistic vision, cultural anchors, lighting
hierarchy, and user interface styling for the real-time Dhaka 3D environment and
refractive glass controls.

## Visual manifesto

The graphics direction bridges the nostalgic, low-to-medium poly atmosphere of
early-2000s open-world video games (such as Grand Theft Auto: Vice City) with
the authentic urban texture, lighting, and vernacular of nighttime Dhaka,
Bangladesh ("পুরান ঢাকা ও ধানমন্ডি গলি").

Rather than sterile, generic modern 3D scenes or flat static photos, the
environment emphasizes depth, mood, local cultural identity, and lived-in
authenticity.

---

## Color palette and lighting hierarchy

The visual mood relies on high contrast between deep midnight indigo shadows and
warm tungsten sodium-vapor street lighting:

| Element | Hex color | Role / atmosphere |
| :--- | :--- | :--- |
| **Atmospheric night fog** | `#080c14` | Deep charcoal indigo density obscuring distant geometry |
| **Ambient fill** | `#141c2c` | Cool midnight sky radiance preventing total black shadows |
| **Directional moonlight** | `#5878b0` | High-angle soft blue moonlight casting directional shadows |
| **Sodium-vapor streetlamps** | `#ff9933` | Warm tungsten amber pooling downward on wet asphalt |
| **Tea stall tungsten bulb** | `#ffaa33` | Warm incandescent glow under corrugated tin roofs |
| **Bengali store neon (cyan)** | `#00e5ff` / `#38bdf8` | High-contrast electric blue storefront highlights |
| **Bengali store neon (pink)** | `#ff007f` / `#f43f5e` | Warm magenta and vermilion signage accents |
| **Cigarette ember flare** | `#ff4d00` → `#ffffff` | Heating from red-orange to white-hot on inhale |

---

## Key architectural and cultural anchors

The 3D environment incorporates five recognizable cultural hallmarks of urban
Bangladesh:

### 1. The roadside tea stall ("চায়ের টং")

A quintessential Bangladeshi fixture built with four rough-hewn timber posts, a
slanted corrugated tin roof with subtle rust weathering, a wooden counter
table, an aluminum tea kettle with spout, stacked glass biscuit jars ("কাচের
বয়াম"), a bench, and an illuminated Bengali signboard:

> **হাবিব ভাই এর চা এর দোকান** — *স্পেশাল মালাই চা ও টোস্ট বিস্কুট*

### 2. The traditional cycle rickshaw

Dhaka's world-famous artisanal vehicle, rendered with a three-spoke wheel
configuration, navy blue tubular bicycle chassis, vinyl passenger cushion, and
a folding canopy adorned with colorful peacock and lotus folk art.

### 3. The green CNG auto-rickshaw ("সিএনজি")

The iconic three-wheeled urban transport of Bangladesh. Features an emerald-green
lower chassis, iconic yellow canvas canopy, protective side wire mesh grilles,
and a single round headlight.

### 4. Modular concrete buildings and balconies

Multi-story concrete structures with roll-down corrugated steel security
shutters, exterior balconies with ornamental iron railings, air conditioner
compressor units, and rooftop water tanks ("গাজী ট্যাংক").

### 5. Overhead tangled cable infrastructure ("ঝুলন্ত তার")

Sagging catenary electrical cables draped between octagonal concrete utility
poles and crossing the street, replicating the chaotic, cinematic density of
Dhaka's skyline.

---

## Camera and first-person ergonomics

The camera is positioned at sidewalk curbside eye level (1.62 meters), looking
slightly down the street toward the tea stall and receding alley:

- **Rotation clamping**: Yaw is clamped to ±37 degrees and pitch to ±20
  degrees, preventing disorienting camera flips while allowing natural street
  exploration.
- **Unlocked cursor look-around**: The mouse cursor remains visible and
  unlocked at all times. Users can click UI elements or drag across the scene to
  look around.
- **Centered viewmodel**: The 3D cigarette viewmodel rests at center screen
  (`Y ≈ 50%–55%`, `X ≈ 50%–52%`), ensuring unobstructed focus during the
  mindful ritual.

---

## Refractive glass user interface aesthetics

The user interface adopts a modern refractive glass aesthetic that floats
elegantly over the 3D scene without obstructing the background world:

- **Frosted semi-transparency**: Panels utilize `backdrop-blur-md` with subtle
  border highlights (`border-white/10`) and dark charcoal translucency
  (`bg-black/40` to `bg-black/60`).
- **Brand pack cards**: Authentic pack cutouts are displayed on rounded frosted
  pill buttons that respond with subtle scale and glow feedback when hovered
  or selected.
- **Atmospheric coherence**: Buttons echo the amber, gold, and cool neon tones
  present in the 3D street scene.

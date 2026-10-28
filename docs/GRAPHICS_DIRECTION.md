# Graphics Direction: Retro Dhaka 3D Environment

## 1. Visual Manifesto
The graphics direction bridges the nostalgic, low-to-medium poly atmosphere of early-2000s retro open-world video games (such as *Grand Theft Auto: Vice City*) with the authentic urban texture, lighting, and vernacular of nighttime **Dhaka, Bangladesh** ("পুরান ঢাকা ও ধানমন্ডি গলি").

Rather than sterile, generic modern 3D or flat static photos, the environment emphasizes **depth, mood, local cultural identity, and lived-in authenticity**.

---

## 2. Color Palette & Lighting Hierarchy

| Element | Hex Color | Role / Atmosphere |
| :--- | :--- | :--- |
| **Atmospheric Night Fog** | `#080c14` | Deep charcoal indigo density, obscuring distant building geometry |
| **Ambient Fill** | `#141c2c` | Cool midnight sky radiance preventing total black shadows |
| **Directional Moonlight** | `#5878b0` | High-angle soft blue moonlight casting sharp building shadows |
| **Sodium Vapor Streetlamps** | `#ff9933` | Warm tungsten amber pooling downward on wet asphalt road |
| **Tea Stall Tungsten Bulb** | `#ffaa33` | Intense, intimate warm incandescent glow under corrugated tin |
| **Bengali Store Neon (Cyan)** | `#00e5ff` / `#38bdf8` | High-contrast electric blue edge highlights on storefronts |
| **Bengali Store Neon (Pink)** | `#ff007f` / `#f43f5e` | Warm magenta/vermilion signage accents |
| **Cigarette Ember Flare** | `#ff4d00` → `#ffffff` | Heating from red-orange to white-hot on inhale, casting light on knuckles |

---

## 3. Key Architectural & Cultural Anchors

### 1. The Roadside Tea Stall ("চায়ের টং")
A quintessential Bangladeshi fixture. Built with four rough-hewn timber posts, a slanted corrugated tin roof with subtle rust weathering, a wooden counter table, a large aluminum tea kettle with spout, stacked glass biscuit jars ("কাচের বয়াম"), a roadside bench, and an illuminated Bengali signboard:
> **ভাই ভাই টি স্টল** — *স্পেশাল মালাই চা ও বিস্কুট*

### 2. The Traditional Cycle Rickshaw
Dhaka's world-famous artisanal vehicle. Rendered with a three-spoke wheel configuration, dark navy blue tubular bicycle chassis, vinyl passenger cushion, and a collapsible folding canopy adorned with colorful folk-art peacock/lotus patterns.

### 3. The Green CNG Auto-Rickshaw ("সিএনজি")
The iconic three-wheeled urban transport of Bangladesh. Features an emerald-green lower chassis, iconic yellow canvas canopy, protective side wire mesh grilles, and a round single headlight.

### 4. Modular Concrete Buildings & Balconies
Multi-story concrete structures with roll-down corrugated steel security shutters, exterior balconies with ornamental iron railings, air conditioner compressor units, and cylindrical rooftop water tanks ("গাজী ট্যাংক").

### 5. Overhead Tangled Cable Infrastructure ("ঝুলন্ত তার")
Sagging catenary electrical cables draped between octagonal concrete utility poles and crossing the street, replicating the chaotic, cinematic density of Dhaka's skyline.

---

## 4. Camera & First-Person Ergonomics
- **Position**: Eye level (1.62m) on the sidewalk curbside.
- **Orientation**: Looking slightly down the street toward the tea stall and receding alley.
- **Rotation Clamping**: Yaw clamped to ±37° and Pitch clamped to ±20° to keep the user immersed without turning away from the detailed composition.
- **Idle Motion**: Subtle organic Lissajous figure-8 breathing sway.

# Image generation and visual reference prompts: Vesper Ritual

This document contains the visual prompts, camera perspectives, and styling
directives used to guide the 3D retro Dhaka environment, application emblems,
and digital humidor pack artwork.

## 1. Retro Dhaka 3D environment (real-time 3D reference)

These directives establish the low-poly nighttime street aesthetic inspired by
vintage open-world video games and nighttime Dhaka.

### Nighttime Dhaka street — Vice City aesthetic

- **Style**: Early-2000s low-poly retro open world 3D game style (GTA: Vice City
  vibes).
- **Subject**: A narrow nighttime street in Dhaka, Bangladesh ("পুরান ঢাকা /
  ধানমন্ডি").
- **Visual anchors**:
  - Roadside tea stall ("চায়ের টং") with corrugated tin roof, rough timber
    posts, glass biscuit jars, and a steaming aluminum kettle under a warm
    glowing bare tungsten bulb.
  - Traditional Dhaka cycle rickshaw with painted folk-art peacock and lotus
    canopy and three-spoke wheels.
  - Emerald green CNG auto-rickshaw with yellow canvas roof and metal wire
    grilles.
  - Tangled overhead electrical cables ("ঝুলন্ত তার") strung between concrete
    utility poles and sodium-vapor amber streetlamps.
  - Weathered multi-story concrete buildings with metal roll-down shutters,
    balconies with iron railings, AC units, and rooftop water tanks ("গাজী
    ট্যাংক").
  - Bengali shopfront signage ("হাবিব ভাই এর চা এর দোকান", "মা ফার্মেসী", "নিউ ঢাকা
    ইলেকট্রনিক্স") with glowing cyan and magenta neon accents.
  - Wet asphalt road with puddle reflections and deep atmospheric night fog.

---

## 2. Brand identity and application emblem

The primary app emblem communicates mindfulness, quiet solitude, and luxury
craftsmanship.

### Luxury wordmark icon (`brand-icon.jpg`)

- **Aspect ratio**: `1:1`
- **Output filename**: `vesper_app_icon`
- **Prompt**:
  > Minimalist luxury brand icon logo for 'Vesper Ritual': a dark circular
  > emblem with a glowing warm ember spark, subtle delicate rising smoke trail,
  > fine gold and dark charcoal metallic texture, deep black background,
  > premium craftsmanship, high-end product design logo.

---

## 3. Atmospheric background still references

These photographic backgrounds serve as atmospheric references and fallback
visualizations.

### Rainy window backdrop (`rainy-window.jpg`)

- **Aspect ratio**: `16:9`
- **Output filename**: `bg_rainy_window`
- **Prompt**:
  > Cinematic nighttime first-person view looking out through a rain-streaked
  > dark window at blurred urban city bokeh lights. Atmospheric, moody charcoal
  > and deep indigo blue tones, soft warm amber streetlamp highlights reflecting
  > in raindrop beads on glass, subtle film grain, ultra realistic photography,
  > shallow depth of field.

### Clear balcony backdrop (`clear-evening.jpg`)

- **Aspect ratio**: `16:9`
- **Output filename**: `bg_clear_balcony`
- **Prompt**:
  > Atmospheric twilight view from a modern high-rise open balcony looking out
  > over a quiet sprawling metropolis at dusk. Deep charcoal blue sky with
  > fading muted amber sunset horizon, dark concrete balcony railing in
  > immediate lower edge, subtle warm city glow, clean cinematic composition,
  > quiet evening solitude.

### Foggy terrace backdrop (`foggy-night.jpg`)

- **Aspect ratio**: `16:9`
- **Output filename**: `bg_foggy_terrace`
- **Prompt**:
  > Cinematic midnight terrace shrouded in dense atmospheric fog and soft misty
  > haze. In the distance, solitary vintage street lamps cast a warm diffuse
  > amber halo through dark fog. Minimalist moody architecture, deep blacks and
  > charcoal tones, poetic quiet atmosphere, film still aesthetic.

---

## 4. Brand humidor pack artwork cutouts

The digital humidor displays nine transparent PNG pack cutouts located in
`public/assets/brands/`. Each image is cropped cleanly with a transparent
background, rendered at a 2:3 vertical proportion (600x900 pixels), and framed
inside semi-transparent frosted buttons within the Refractive Glass UI.

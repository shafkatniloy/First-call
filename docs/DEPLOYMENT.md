# Zero-cost deployment guide: Vesper Ritual

This guide explains how to deploy Vesper Ritual using Vercel's Hobby Free Tier
or alternative zero-cost static hosting platforms such as Cloudflare Pages and
Netlify.

## 1. Zero-cost infrastructure architecture

The application is structured to incur zero recurring operational hosting
costs:

- **Application hosting**: Vercel Hobby Tier (100 GB bandwidth, unlimited
  personal projects).
- **Compute and rendering**: Next.js App Router client-side execution with
  static prerendering.
- **Storage**: Client-side browser `localStorage` (zero server database costs).
- **3D engine and media**: Bundled Three.js WebGL runtime and local assets in
  `public/assets/`.
- **Audio engine**: In-browser Web Audio API procedural synthesis (zero audio
  streaming bandwidth).

---

## 2. Deploying to Vercel (step-by-step)

Deploying from a GitHub repository takes less than two minutes.

### Prerequisites

- A free [GitHub](https://github.com) account.
- A free [Vercel](https://vercel.com) account.

### Step 1: Push code to GitHub

```bash
git add .
git commit -m "feat: release 3D retro Dhaka ritual with glass UI"
git branch -M main
git remote add origin https://github.com/<your-username>/vesper-ritual.git
git push -u origin main
```

### Step 2: Import project into Vercel

1. Log in to your Vercel Dashboard.
2. Click **Add New...** → **Project**.
3. Select your `vesper-ritual` repository from the project list.
4. Keep the Framework Preset as **Next.js**.
5. Keep Build Command as `npm run build` and Output Directory as `.next`
   (default).
6. Environment variables: None required for baseline deployment.
7. Click **Deploy**.

Vercel builds and deploys the application automatically, providing a live URL
such as `https://vesper-ritual.vercel.app`.

---

## 3. Alternative hosting: Cloudflare Pages or static export

If deploying to static hosting environments like Cloudflare Pages or GitHub
Pages:

1. In `next.config.mjs`, enable static HTML export:
   ```javascript
   const nextConfig = {
     output: "export",
     images: { unoptimized: true },
   };
   export default nextConfig;
   ```
2. Run `npm run build`. This generates a standalone static distribution in
   `/out/`.
3. Point your static host to the `/out/` directory.

---

## 4. Common deployment pitfalls and troubleshooting

Keep these edge cases in mind when verifying production builds:

### Web Audio autoplay policies

Modern mobile browsers (especially iOS Safari) require an initial user
interaction before audio playback is permitted. Vesper Ritual handles this by
lazily resuming the `AudioContext` inside user click handlers on the starting
page and ritual controls.

### Client-side WebGL canvas rendering

Because Three.js requires direct access to browser DOM and WebGL contexts, all
pages referencing `DhakaSceneCanvas` must wrap the component in `next/dynamic`
with `{ ssr: false }` to prevent Node.js server prerendering collisions.

### Defensive local storage validation

If a user visits from an older browser version or with corrupted storage data,
`StorageManager` uses Zod schemas to sanitize and auto-repair data without
throwing unhandled exceptions or blank screens.

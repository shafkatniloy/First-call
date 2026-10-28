# Zero-Cost Deployment Guide: Vesper Ritual

This guide outlines how to deploy Vesper Ritual using **Vercel's eligible Hobby Free Tier** or alternative zero-cost static hosts (e.g., Cloudflare Pages, Netlify).

---

## 1. Zero-Cost Infrastructure Architecture
- **Application Hosting**: Vercel Hobby Tier (100 GB bandwidth, unlimited personal projects).
- **Compute / Rendering**: Next.js App Router static prerendering (Static Export / SSG).
- **Storage**: Client-side `localStorage` (0 server database costs).
- **Media**: Local public assets (`public/assets/`) bundled directly with the application.
- **Audio Engine**: Client-side Web Audio API synthesis (0 streaming or bandwidth cost).

---

## 2. Deploying to Vercel (Step-by-Step)

### Prerequisites
- A free [GitHub](https://github.com) account.
- A free [Vercel](https://vercel.com) account.

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: release initial Vesper Ritual web app"
git branch -M main
git remote add origin https://github.com/<your-username>/vesper-ritual.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to your Vercel Dashboard.
2. Click **Add New...** → **Project**.
3. Select your `vesper-ritual` repository from the GitHub list.
4. Keep the Framework Preset as **Next.js**.
5. Keep Build Command as `npm run build` and Output Directory as `.next` (default).
6. Environment Variables: None required for MVP.
7. Click **Deploy**.

Vercel will build and deploy the application in under 60 seconds, assigning a live URL like `https://vesper-ritual.vercel.app`.

---

## 3. Alternative Hosting: Cloudflare Pages / Static Export

If deploying to Cloudflare Pages or GitHub Pages:
1. In `next.config.mjs`, enable static HTML export:
   ```javascript
   const nextConfig = {
     output: "export",
     images: { unoptimized: true }
   };
   export default nextConfig;
   ```
2. Run `npm run build`. This generates a standalone static distribution in `/out/`.
3. Point your static host to the `/out` directory.

---

## 4. Common Deployment Pitfalls & Troubleshooting

### Issue 1: Web Audio Not Playing on Mobile Safari
- **Cause**: iOS Safari blocks Web Audio unless initiated by an explicit user gesture (`touchstart` or `click`).
- **Resolution**: Vesper Ritual handles this automatically by unlocking `AudioContext` inside user click handlers on the Landing and HUD controls.

### Issue 2: Large Asset LCP (Largest Contentful Paint)
- **Resolution**: Background images in `public/assets/backgrounds/` are preloaded with `priority` and optimized as progressive JPEGs under 1MB.

### Issue 3: Corrupted LocalStorage across Browsers
- **Resolution**: `StorageManager` includes defensive Zod validation that auto-repairs any schema divergence without white-screening the app.

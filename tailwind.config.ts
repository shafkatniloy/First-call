import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        charcoal: {
          950: "#08090a",
          900: "#0e1013",
          850: "#14171c",
          800: "#1a1e24",
          700: "#262b34",
          600: "#363d49",
        },
        ember: {
          glow: "#ff3700",
          core: "#ff8c42",
          hot: "#ffddaa",
          ash: "#8c857b",
        },
        accent: {
          amber: "#d97706",
          parchment: "#f5f2eb",
          smoke: "#9ca3af",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        ember: "0 0 25px 4px rgba(255, 77, 0, 0.45)",
        "ember-intense": "0 0 45px 12px rgba(255, 90, 0, 0.75)",
        cinematic: "0 20px 50px rgba(0, 0, 0, 0.8)",
      },
      keyframes: {
        "ember-pulse": {
          "0%, 100%": { opacity: "0.85", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        "smoke-curl": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.6" },
          "100%": { transform: "translateY(-120px) scale(1.8)", opacity: "0" },
        },
        "gentle-breath": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(6px) rotate(-0.5deg)" },
        },
      },
      animation: {
        "ember-pulse": "ember-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "smoke-curl": "smoke-curl 4s ease-out infinite",
        "gentle-breath": "gentle-breath 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

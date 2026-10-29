import type { Metadata, Viewport } from "next";
import "./globals.css";
import { APP_CONFIG } from "@/config/app.config";

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} — Immersive Smoking-Reduction Ritual`,
  description: APP_CONFIG.tagline,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
      { url: "/assets/brand-icon.jpg" },
    ],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/assets/brand-icon.jpg" },
    ],
  },
  keywords: ["smoking reduction", "harm reduction", "digital ritual", "cigarette alternative", "mindful breathing"],
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-charcoal-950">
      <body className="min-h-screen bg-charcoal-950 text-neutral-100 antialiased selection:bg-amber-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

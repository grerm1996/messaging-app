import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // generates 'manifest.webmanifest' file on build
      manifest: {
        // caches the assets/icons mentioned (assets/* includes all the assets present in your src/ directory)
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "assets/*"],
        name: "chatapp",
        short_name: "chatapp",
        start_url: "/messaging-app/",
        scope: "/messaging-app/",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/icon-512x512.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-192x192.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        // defining cached files formats
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      },
    }),
  ],
  base: "/messaging-app/",
});

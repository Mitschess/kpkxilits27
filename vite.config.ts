import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks so content updates don't bust their cache
        manualChunks: {
          react: ["react", "react-dom", "react-dom/client", "react-router"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});

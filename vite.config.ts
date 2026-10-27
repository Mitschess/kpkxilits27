import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { inventoryApi } from "./fund/server/inventory-api.js";

const fundApp = {
  name: "fund-app",
  configureServer(server: import("vite").ViteDevServer) {
    server.middlewares.use((request, response, next) => {
      const pathname = request.url?.split("?", 1)[0];
      if (pathname === "/fund") {
        response.writeHead(302, { Location: "/fund/" });
        response.end();
        return;
      }
      next();
    });
    server.middlewares.use("/api", inventoryApi());
  },
  configurePreviewServer(server: import("vite").PreviewServer) {
    server.middlewares.use("/api", inventoryApi());
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), fundApp],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "index.html"),
        fund: path.resolve(import.meta.dirname, "fund/index.html"),
      },
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

import path from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

type InventoryApiModule = typeof import("./fund/server/inventory-api.js");

function loadInventoryApi() {
  const modulePath = path.resolve(import.meta.dirname, "fund/server/inventory-api.js");
  return import(pathToFileURL(modulePath).href) as Promise<InventoryApiModule>;
}

const fundApp = {
  name: "fund-app",
  async configureServer(server: import("vite").ViteDevServer) {
    server.middlewares.use((request, response, next) => {
      const pathname = request.url?.split("?", 1)[0];
      if (pathname === "/fund") {
        response.writeHead(302, { Location: "/fund/" });
        response.end();
        return;
      }
      next();
    });
    const { inventoryApi } = await loadInventoryApi();
    server.middlewares.use("/api", inventoryApi());
  },
  async configurePreviewServer(server: import("vite").PreviewServer) {
    const { inventoryApi } = await loadInventoryApi();
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

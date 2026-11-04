import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    proxy: {
      "/api/caldock": {
        target: "http://127.0.0.1:4180",
        rewrite: path => path.replace(/^\/api/, ""),
      },
    },
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), {
    name: "caldock-local-account-mount",
    configureServer(server) {
      // Match the production account path, including OAuth return URLs.
      server.middlewares.use((request, _response, next) => {
        if (request.url?.startsWith("/caldock/")) request.url = request.url.slice("/caldock".length);
        next();
      });
    },
  }],
});

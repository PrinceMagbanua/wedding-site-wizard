import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // When deploying to GitHub Pages, Vite should serve under repo subpath.
  // Vite exposes this as import.meta.env.BASE_URL and we also use it in Router basename.
  base: process.env.VITE_BASE ?? "/",
  build: {
    // Build to 'docs' so GitHub Pages can serve from main branch /docs
    outDir: "docs",
    emptyOutDir: true,
  },
  server: {
    host: "::",
    port: 8020,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

import path from "node:path";
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    // Rules tests need the Firestore emulator; they run via `npm run test:rules`,
    // not the default suite (see vitest.rules.config.ts).
    exclude: [...configDefaults.exclude, "test/rules/**"],
  },
});

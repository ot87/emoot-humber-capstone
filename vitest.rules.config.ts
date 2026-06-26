import { defineConfig } from "vitest/config";

// Firestore security-rules tests run against the emulator (launched by the
// `test:rules` script via `firebase emulators:exec`), so they live in their own
// Node-environment project and are excluded from the default jsdom test run.
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/rules/**/*.test.ts"],
  },
});

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@lib": new URL("./src/lib.ts", import.meta.url).pathname,
    },
  },
  test: {
    // Run the .solution.ts files that contain runtime `describe` blocks.
    include: ["topics/**/*.solution.ts"],
    // Pure type-level files have no test functions; allow no-test files.
    passWithNoTests: true,
  },
});

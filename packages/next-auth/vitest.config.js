import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/lib/__tests__/**/*.js", "src/server/lib/__tests__/**/*.js"],
    exclude: ["src/client/__tests__/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["**/node_modules/**", "**/dist/**", "src/**/__tests__/**"],
    },
  },
})

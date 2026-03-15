import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["test/setup.js"],
    include: [
      "src/lib/__tests__/**/*.js", 
      "src/server/lib/__tests__/**/*.js",
      "src/client/__tests__/**/*.jsx"
    ],
    env: {
      NEXTAUTH_URL: "http://localhost:3000/api/auth",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["**/node_modules/**", "**/dist/**", "src/**/__tests__/**"],
    },
  },
})

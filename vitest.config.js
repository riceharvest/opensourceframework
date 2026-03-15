import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/test/visual/**'],
    env: {
      NEXTAUTH_URL: "http://localhost:3000/api/auth",
    },
  },
})

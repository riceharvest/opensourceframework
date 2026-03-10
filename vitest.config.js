import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    env: {
      NEXTAUTH_URL: "http://localhost:3000/api/auth",
    },
  },
})

import { test, expect } from "@playwright/test"

test.describe("NextAuth.js Hydration Error Test", () => {
  test("should not have hydration errors on page load", async ({ page }) => {
    const consoleErrors = []

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text())
      }
    })

    page.on("pageerror", (error) => {
      consoleErrors.push(error.message)
    })

    await page.goto("http://localhost:3000")

    await page.waitForLoadState("networkidle")

    const hydrationErrors = consoleErrors.filter(
      (err) =>
        err.includes("Hydration") ||
        err.includes("hydration") ||
        err.includes("did not match"),
    )

    expect(hydrationErrors).toHaveLength(0)
  })

  test("useSession should work without errors", async ({ page }) => {
    const consoleErrors = []

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto("http://localhost:3000")
    await page.waitForLoadState("networkidle")

    const statusText = await page.textContent("p")
    expect(statusText).toContain("Status:")

    const hasSessionError = consoleErrors.some(
      (err) => err.includes("useSession") || err.includes("Client"),
    )
    expect(hasSessionError).toBe(false)
  })
})

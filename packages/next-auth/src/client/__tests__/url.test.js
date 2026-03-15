import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import _logger from "../../lib/logger"

// Mock dependencies
vi.mock("../../lib/logger", () => ({
  default: {
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
  proxyLogger: vi.fn((l) => l),
}))

vi.mock("../lib/parse-url", () => ({
  default: vi.fn((url) => ({
    baseUrl: "http://localhost:3000",
    basePath: "/api/auth",
    url: {
      origin: "http://localhost:3000",
      pathname: "/api/auth",
      href: "http://localhost:3000/api/auth",
    },
  })),
}))

describe("client url handling", () => {
  const originalWindow = global.window
  const originalDocument = global.document
  const originalProcess = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalProcess }
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    process.env = originalProcess
  })

  it("should return absolute URL when window is undefined (server-side)", async () => {
    vi.stubGlobal("window", undefined)
    vi.stubGlobal("document", undefined)
    
    // Mock global fetch
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal("fetch", mockFetch)

    const { getSession } = await import("../index")
    await getSession()
    
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("http://localhost:3000/api/auth/session"),
      expect.any(Object)
    )
  })

  it("should return relative URL when window is defined (client-side)", async () => {
    vi.stubGlobal("window", {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      location: {
        href: "http://localhost:3000",
      },
    })
    vi.stubGlobal("document", {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    
    // Mock global fetch
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal("fetch", mockFetch)

    const { getSession } = await import("../index")
    await getSession()
    
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/^\/api\/auth\/session/),
      expect.any(Object)
    )
  })
})

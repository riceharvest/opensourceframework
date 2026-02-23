import { describe, it, expect } from "vitest"
import { set, defaultCookies } from "../cookie.js"

describe("Cookies", () => {
  describe("set", () => {
    it("should set a simple cookie", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      set(res, "test-cookie", "test-value")

      const setCookieHeader = res.getHeader("Set-Cookie")
      expect(setCookieHeader).toBeDefined()
      expect(setCookieHeader[0]).toContain("test-cookie=test-value")
    })

    it("should set a cookie with maxAge", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      set(res, "test-cookie", "test-value", { maxAge: 3600 })

      const setCookieHeader = res.getHeader("Set-Cookie")
      expect(setCookieHeader[0]).toContain("Max-Age=3")
    })

    it("should set a cookie with domain", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      set(res, "test-cookie", "test-value", { domain: "example.com" })

      const setCookieHeader = res.getHeader("Set-Cookie")
      expect(setCookieHeader[0]).toContain("Domain=example.com")
    })

    it("should set a cookie with path", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      set(res, "test-cookie", "test-value", { path: "/api" })

      const setCookieHeader = res.getHeader("Set-Cookie")
      expect(setCookieHeader[0]).toContain("Path=/api")
    })

    it("should set a cookie with expires", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      const expiresDate = new Date("2025-01-01T00:00:00Z")
      set(res, "test-cookie", "test-value", { expires: expiresDate })

      const setCookieHeader = res.getHeader("Set-Cookie")
      expect(setCookieHeader[0]).toContain("Expires=")
    })

    it("should set httpOnly cookie", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      set(res, "test-cookie", "test-value", { httpOnly: true })

      const setCookieHeader = res.getHeader("Set-Cookie")
      expect(setCookieHeader[0]).toContain("HttpOnly")
    })

    it("should set secure cookie", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      set(res, "test-cookie", "test-value", { secure: true })

      const setCookieHeader = res.getHeader("Set-Cookie")
      expect(setCookieHeader[0]).toContain("Secure")
    })

    it("should set sameSite=lax", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      set(res, "test-cookie", "test-value", { sameSite: "lax" })

      const setCookieHeader = res.getHeader("Set-Cookie")
      expect(setCookieHeader[0]).toContain("SameSite=Lax")
    })

    it("should set sameSite=strict", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      set(res, "test-cookie", "test-value", { sameSite: "strict" })

      const setCookieHeader = res.getHeader("Set-Cookie")
      expect(setCookieHeader[0]).toContain("SameSite=Strict")
    })

    it("should set sameSite=none", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      set(res, "test-cookie", "test-value", { sameSite: "none" })

      const setCookieHeader = res.getHeader("Set-Cookie")
      expect(setCookieHeader[0]).toContain("SameSite=None")
    })

    it("should serialize object values as JSON", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      const obj = { key: "value" }
      set(res, "test-cookie", obj)

      const setCookieHeader = res.getHeader("Set-Cookie")
      expect(setCookieHeader[0]).toContain("j%3A%7B%22key%22%3A%22value%22%7D")
    })

    it("should preserve existing cookies when setting new ones", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      res.setHeader("Set-Cookie", ["existing-cookie=existing-value"])

      set(res, "test-cookie", "test-value")

      const setCookieHeader = res.getHeader("Set-Cookie")
      expect(setCookieHeader).toHaveLength(2)
      expect(setCookieHeader[0]).toContain("existing-cookie=existing-value")
      expect(setCookieHeader[1]).toContain("test-cookie=test-value")
    })

    it("should throw error for invalid sameSite value", () => {
      const res = {
        headers: new Map(),
        getHeader(name) {
          return this.headers.get(name)
        },
        setHeader(name, value) {
          this.headers.set(name, value)
        },
      }

      expect(() => {
        set(res, "test-cookie", "test-value", { sameSite: "invalid" })
      }).toThrow("option sameSite is invalid")
    })
  })

  describe("defaultCookies", () => {
    it("should return default cookies with non-secure prefix", () => {
      const cookies = defaultCookies(false)

      expect(cookies.sessionToken.name).toBe("next-auth.session-token")
      expect(cookies.callbackUrl.name).toBe("next-auth.callback-url")
      expect(cookies.csrfToken.name).toBe("next-auth.csrf-token")
      expect(cookies.pkceCodeVerifier.name).toBe("next-auth.pkce.code_verifier")
    })

    it("should return default cookies with secure prefix", () => {
      const cookies = defaultCookies(true)

      expect(cookies.sessionToken.name).toBe("__Secure-next-auth.session-token")
      expect(cookies.callbackUrl.name).toBe("__Secure-next-auth.callback-url")
      expect(cookies.csrfToken.name).toBe("__Host-next-auth.csrf-token")
      expect(cookies.pkceCodeVerifier.name).toBe(
        "__Secure-next-auth.pkce.code_verifier",
      )
    })

    it("should include correct options for session token", () => {
      const cookies = defaultCookies(true)

      expect(cookies.sessionToken.options.httpOnly).toBe(true)
      expect(cookies.sessionToken.options.sameSite).toBe("lax")
      expect(cookies.sessionToken.options.path).toBe("/")
      expect(cookies.sessionToken.options.secure).toBe(true)
    })
  })
})

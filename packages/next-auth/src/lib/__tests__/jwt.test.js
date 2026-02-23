import { describe, it, expect, beforeEach, vi } from "vitest"
import { encode, decode, getToken } from "../jwt.js"

describe("JWT", () => {
  const secret = "test-secret-key"

  describe("encode", () => {
    it("should encode a token with default options", async () => {
      const token = { sub: "user-123", name: "Test User" }
      const encoded = await encode({ token, secret })

      expect(encoded).toBeDefined()
      expect(typeof encoded).toBe("string")
    })

    it("should encode a token with custom maxAge", async () => {
      const token = { sub: "user-123" }
      const encoded = await encode({ token, secret, maxAge: 3600 })

      expect(encoded).toBeDefined()
    })

    it("should encode and encrypt a token when encryption is enabled", async () => {
      const token = { sub: "user-123", name: "Test User" }
      const encoded = await encode({
        token,
        secret,
        encryption: true,
      })

      expect(encoded).toBeDefined()
      expect(typeof encoded).toBe("string")
    })
  })

  describe("decode", () => {
    it("should decode a previously encoded token", async () => {
      const token = { sub: "user-123", name: "Test User" }
      const encoded = await encode({ token, secret })
      const decoded = await decode({ token: encoded, secret })

      expect(decoded).toBeDefined()
      expect(decoded.sub).toBe("user-123")
      expect(decoded.name).toBe("Test User")
    })

    it("should return null for null token", async () => {
      const decoded = await decode({ token: null, secret })
      expect(decoded).toBeNull()
    })

    it("should return null for undefined token", async () => {
      const decoded = await decode({ token: undefined, secret })
      expect(decoded).toBeNull()
    })

    it("should decode an encrypted token", async () => {
      const token = { sub: "user-123", name: "Test User" }
      const encoded = await encode({ token, secret, encryption: true })
      const decoded = await decode({ token: encoded, secret, encryption: true })

      expect(decoded).toBeDefined()
      expect(decoded.sub).toBe("user-123")
    })
  })

  describe("getToken", () => {
    it("should throw error if req is not provided", async () => {
      await expect(getToken({})).rejects.toThrow(
        "Must pass `req` to JWT getToken()",
      )
    })

    it("should return raw token when raw is true", async () => {
      const mockReq = {
        cookies: {
          "next-auth.session-token": "raw-token-value",
        },
      }

      const token = await getToken({
        req: mockReq,
        raw: true,
      })

      expect(token).toBe("raw-token-value")
    })

    it("should return decoded token from cookie", async () => {
      const token = { sub: "user-123" }
      const encoded = await encode({ token, secret })

      const mockReq = {
        cookies: {
          "next-auth.session-token": encoded,
        },
      }

      const result = await getToken({ req: mockReq, secret })
      expect(result).toBeDefined()
      expect(result.sub).toBe("user-123")
    })

    it("should return token from Authorization header", async () => {
      const token = { sub: "user-123" }
      const encoded = await encode({ token, secret })
      const encodedURI = encodeURIComponent(encoded)

      const mockReq = {
        cookies: {},
        headers: {
          authorization: `Bearer ${encodedURI}`,
        },
      }

      const result = await getToken({ req: mockReq, secret })
      expect(result).toBeDefined()
      expect(result.sub).toBe("user-123")
    })

    it("should return null for invalid token", async () => {
      const mockReq = {
        cookies: {
          "next-auth.session-token": "invalid-token",
        },
      }

      try {
        const result = await getToken({ req: mockReq, secret })
        expect(result).toBeNull()
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it("should use secure cookie name when secureCookie is true", async () => {
      const token = { sub: "user-123" }
      const encoded = await encode({ token, secret })

      const mockReq = {
        cookies: {
          "__Secure-next-auth.session-token": encoded,
        },
      }

      const result = await getToken({
        req: mockReq,
        secret,
        secureCookie: true,
      })

      expect(result).toBeDefined()
      expect(result.sub).toBe("user-123")
    })
  })
})

import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import {
  getUserProfile,
  handleApiResponse,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
} from "../examples/vite/src/lib/api";
import { getUser, setUser, validatePassword } from "../examples/vite/src/mocks/db";
import { storage } from "../examples/vite/src/lib/utils";

describe("examples/vite api helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("handleApiResponse returns parsed JSON on success", async () => {
    const response = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });

    await expect(handleApiResponse<{ ok: boolean }>(response)).resolves.toEqual({
      ok: true,
    });
  });

  test("handleApiResponse throws generic error on failure", async () => {
    const response = new Response(JSON.stringify({ message: "internal details" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });

    await expect(handleApiResponse(response)).rejects.toThrow(
      "Request failed. Please try again."
    );
  });

  test("storage.getToken safely handles malformed values", () => {
    window.localStorage.setItem("token", "{invalid");
    expect(storage.getToken()).toBeNull();

    window.localStorage.setItem("token", JSON.stringify("bad\r\nvalue"));
    expect(storage.getToken()).toBeNull();
  });

  test("getUserProfile only sends Authorization when token is valid", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ user: undefined }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    await getUserProfile();
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/auth/me",
      expect.objectContaining({ headers: undefined })
    );

    window.localStorage.setItem("token", JSON.stringify("token-value"));
    await getUserProfile();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/auth/me",
      expect.objectContaining({ headers: { Authorization: "token-value" } })
    );
  });

  test("login and register send JSON content type", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ jwt: "token", user: { id: "1", email: "u@x.dev" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    await loginWithEmailAndPassword({ email: "u@x.dev", password: "pw" });
    await registerWithEmailAndPassword({
      email: "u2@x.dev",
      password: "pw",
      name: "User",
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/auth/register",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  test("mock db does not persist passwords in localStorage", () => {
    const created = setUser({
      email: "db@example.com",
      name: "DB User",
      password: "secret",
    });

    expect(created).toEqual({
      id: "db@example.com",
      email: "db@example.com",
      name: "DB User",
    });
    expect(getUser("db@example.com")).toEqual(created);
    expect(validatePassword("db@example.com", "secret")).toBe(true);

    const rawDb = window.localStorage.getItem("db_users");
    expect(rawDb).toBeTruthy();
    expect(rawDb).not.toContain("secret");
  });
});

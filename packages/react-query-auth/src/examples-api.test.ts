import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import {
  getUserProfile,
  handleApiResponse,
} from "../examples/vite/src/lib/api";
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
});

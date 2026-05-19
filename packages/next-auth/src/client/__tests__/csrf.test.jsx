// @vitest-environment happy-dom
import React from "react"
import { http, HttpResponse } from "msw"
import { useState } from "react"
import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/react"
import { server, mockCSRFToken } from "./helpers/mocks"
import logger from "../../lib/logger"
import { getCsrfToken } from ".."

vi.mock("../../lib/logger", () => ({
  __esModule: true,
  default: {
    warn: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
  proxyLogger(logger) {
    return logger
  },
}))

beforeAll(() => {
  server.listen()
  if (typeof window !== "undefined") {
    vi.spyOn(window.location, "replace").mockImplementation(() => {})
    vi.spyOn(window.location, "reload").mockImplementation(() => {})
  }
})

afterEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
})

afterAll(() => {
  server.close()
})

test("returns the Cross Site Request Forgery Token (CSRF Token) required to make POST requests", async () => {
  render(<CSRFFlow />)

  await userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(screen.getByTestId("csrf-result").textContent).toEqual(
      mockCSRFToken.csrfToken
    )
  })
})

test("when there's no CSRF token returned, it'll reflect that", async () => {
  server.use(
    http.get("/api/auth/csrf", () =>
      HttpResponse.json({
        ...mockCSRFToken,
        csrfToken: null,
      })
    )
  )

  render(<CSRFFlow />)

  await userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(screen.getByTestId("csrf-result").textContent).toBe("null-response")
  })
})

test("when the fetch fails it'll throw a client fetch error", async () => {
  server.use(
    http.get("/api/auth/csrf", () =>
      new HttpResponse("some error happened", { status: 500 })
    )
  )

  render(<CSRFFlow />)

  await userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(logger.error).toBeCalledWith(
      "CLIENT_FETCH_ERROR",
      "csrf",
      expect.any(SyntaxError)
    )
  })
})

function CSRFFlow() {
  const [response, setResponse] = useState()

  async function handleCSRF() {
    const result = await getCsrfToken()
    setResponse(result)
  }

  return (
    <>
      <p data-testid="csrf-result">
        {response === null ? "null-response" : response || "no response"}
      </p>
      <button onClick={handleCSRF}>Get CSRF</button>
    </>
  )
}

// @vitest-environment happy-dom
import React from "react"
import { http, HttpResponse } from "msw"
import { useState } from "react"
import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/react"
import { server, mockProviders } from "./helpers/mocks"
import { getProviders } from ".."
import logger from "../../lib/logger"

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

test("when called it'll return the currently configured providers for sign in", async () => {
  render(<ProvidersFlow />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(screen.getByTestId("providers-result").textContent).toEqual(
      JSON.stringify(mockProviders)
    )
  })
})

test("when failing to fetch the providers, it'll log the error", async () => {
  server.use(
    http.get("/api/auth/providers", () =>
      new HttpResponse("some error happened", { status: 500 })
    )
  )

  render(<ProvidersFlow />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(logger.error).toBeCalledWith(
      "CLIENT_FETCH_ERROR",
      "providers",
      expect.any(SyntaxError)
    )
  })
})

function ProvidersFlow() {
  const [response, setResponse] = useState()

  async function handleGerProviders() {
    const result = await getProviders()
    setResponse(result)
  }

  return (
    <>
      <p data-testid="providers-result">
        {response === null
          ? "null-response"
          : JSON.stringify(response) || "no response"}
      </p>
      <button onClick={handleGerProviders}>Get Providers</button>
    </>
  )
}

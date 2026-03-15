// @vitest-environment happy-dom
import React from "react"
import { http, HttpResponse } from "msw"
import { useState } from "react"
import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/react"
import { server, mockSignOutResponse } from "./helpers/mocks"
import { signOut } from ".."
import { getBroadcastEvents } from "./helpers/utils"


beforeAll(() => {
  server.listen()
  if (typeof window !== "undefined") {
    vi.spyOn(window.location, "replace").mockImplementation(() => {})
    vi.spyOn(window.location, "reload").mockImplementation(() => {})
  }
})

beforeEach(() => {
   
  vi.spyOn(window.localStorage, "setItem")
})

afterEach(() => {
  vi.clearAllMocks()
  server.resetHandlers()
})

afterAll(() => {
  window.location = location
  server.close()
})

const callbackUrl = "https://redirects/to"

test("by default it redirects to the current URL if the server did not provide one", async () => {
  server.use(
    http.post("/api/auth/signout", () =>
      HttpResponse.json({ ...mockSignOutResponse, url: undefined }, { status: 200 })
    )
  )

  render(<SignOutFlow />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith(window.location.href)
  })
})

test("it redirects to the URL allowed by the server", async () => {
  render(<SignOutFlow callbackUrl={callbackUrl} />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith(
      mockSignOutResponse.url
    )
  })
})

test("if url contains a hash during redirection a page reload happens", async () => {
  const mockUrlWithHash = "https://path/to/email/url#foo-bar-baz"

  server.use(
    http.post("/api/auth/signout", () => {
      return HttpResponse.json({
        ...mockSignOutResponse,
        url: mockUrlWithHash,
      })
    })
  )

  render(<SignOutFlow />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(window.location.reload).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith(mockUrlWithHash)
  })
})

test("will broadcast the signout event to other tabs", async () => {
  render(<SignOutFlow />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    const broadcastCalls = getBroadcastEvents()
    const [broadcastedEvent] = broadcastCalls

    expect(broadcastCalls).toHaveLength(1)
    expect(broadcastedEvent.eventName).toBe("nextauth.message")
    expect(broadcastedEvent.value).toStrictEqual({
      data: {
        trigger: "signout",
      },
      event: "session",
    })
  })
})

function SignOutFlow({ callbackUrl, redirect = true }) {
  const [response, setResponse] = useState(null)

  async function handleSignOut() {
    const result = await signOut({ callbackUrl, redirect })
    setResponse(result)
  }

  return (
    <>
      <p data-testid="signout-result">
        {response ? JSON.stringify(response) : "no response"}
      </p>
      <button onClick={handleSignOut}>Sign out</button>
    </>
  )
}

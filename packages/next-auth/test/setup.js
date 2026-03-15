/* global window */
import { vi } from "vitest"
import "@testing-library/jest-dom"

if (typeof window !== "undefined") {
  // Set window.location.href directly before anything else
  // Happy-DOM allows setting href
  window.location.href = "http://localhost:3000/api/auth"
  
  const location = new URL(window.location.href)
  
  vi.stubGlobal("location", {
    replace: vi.fn(),
    reload: vi.fn(),
    href: location.href,
    origin: location.origin,
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    toString: () => location.href,
  })
}

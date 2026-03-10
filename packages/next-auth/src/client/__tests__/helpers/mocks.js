import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"
import { randomBytes } from "crypto"

export const mockSession = {
  ok: true,
  user: {
    image: null,
    name: "John",
    email: "john@email.com",
  },
  expires: 123213139,
}

export const mockProviders = {
  ok: true,
  github: {
    id: "github",
    name: "Github",
    type: "oauth",
    signinUrl: "path/to/signin",
    callbackUrl: "path/to/callback",
  },
  credentials: {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    authorize: null,
    credentials: null,
  },
  email: {
    id: "email",
    type: "email",
    name: "Email",
  },
}

export const mockCSRFToken = {
  ok: true,
  csrfToken: randomBytes(32).toString("hex"),
}

export const mockGithubResponse = {
  ok: true,
  status: 200,
  url: "https://path/to/github/url",
}

export const mockCredentialsResponse = {
  ok: true,
  status: 200,
  url: "https://path/to/credentials/url",
}

export const mockEmailResponse = {
  ok: true,
  status: 200,
  url: "https://path/to/email/url",
}

export const mockSignOutResponse = {
  ok: true,
  status: 200,
  url: "https://path/to/signout/url",
}

const BASE_URL = "*/api/auth"

export const server = setupServer(
  http.post(`${BASE_URL}/signout`, () =>
    HttpResponse.json(mockSignOutResponse)
  ),
  http.get(`${BASE_URL}/session`, () =>
    HttpResponse.json(mockSession)
  ),
  http.get(`${BASE_URL}/csrf`, () =>
    HttpResponse.json(mockCSRFToken)
  ),
  http.get(`${BASE_URL}/providers`, () =>
    HttpResponse.json(mockProviders)
  ),
  http.post(`${BASE_URL}/signin/github`, () =>
    HttpResponse.json(mockGithubResponse)
  ),
  http.post(`${BASE_URL}/callback/credentials`, () =>
    HttpResponse.json(mockCredentialsResponse)
  ),
  http.post(`${BASE_URL}/signin/email`, () =>
    HttpResponse.json(mockEmailResponse)
  ),
  http.post(`${BASE_URL}/_log`, () => new HttpResponse(null, { status: 200 }))
)

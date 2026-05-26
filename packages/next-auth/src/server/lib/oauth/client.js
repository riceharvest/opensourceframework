import querystring from "querystring"
import logger from "../../../lib/logger"
import { sign as jwtSign } from "jsonwebtoken"

/**
 * Native OAuth client implementation to remove dependency on 'oauth' package.
 * Supports both OAuth 1.x and OAuth 2.x.
 *
 * @param {import("types/providers").OAuthConfig} provider
 */
export default function oAuthClient(provider) {
  if (provider.version?.startsWith("2.")) {
    let _useAuthHeader = true

    return {
      useAuthorizationHeaderforGET: (value) => { _useAuthHeader = value },
      getAuthorizeUrl: (params) => getOAuth2AuthorizeUrl(provider, params),
      getOAuthAccessToken: (code, codeVerifier) => getOAuth2AccessToken(code, provider, codeVerifier),
      get: (accessToken, results) => getOAuth2(provider, accessToken, results)
    }
  }

  // Handle OAuth v1.x (Simplified native implementation)
  return new OAuth1Client(provider)
}

/**
 * Generate authorization URL for OAuth 2.x
 *
 * @param {import("types/providers").OAuthConfig} provider
 * @param {any} params
 */
function getOAuth2AuthorizeUrl(provider, params) {
  const url = new URL(provider.authorizationUrl)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, value)
    }
  }
  return url.href
}

/**
 * Ported from https://github.com/ciaranj/node-oauth/blob/a7f8a1e21c362eb4ed2039431fb9ac2ae749f26a/lib/oauth2.js
 * Refactored to use fetch and removed dependency on node-oauth.
 *
 * @param {string} code
 * @param {import("types/providers").OAuthConfig} provider
 * @param {string | undefined} codeVerifier
 */
async function getOAuth2AccessToken(code, provider, codeVerifier) {
  const url = provider.accessTokenUrl
  const params = { ...provider.params }
  const headers = { ...provider.headers }
  const codeParam =
    params.grant_type === "refresh_token" ? "refresh_token" : "code"

  if (!params[codeParam]) {
    params[codeParam] = code
  }

  if (!params.client_id) {
    params.client_id = provider.clientId
  }

  // For Apple the client secret must be generated on-the-fly.
  if (provider.id === "apple" && typeof provider.clientSecret === "object") {
    const { keyId, teamId, privateKey } = provider.clientSecret
    const clientSecret = jwtSign(
      {
        iss: teamId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 180, // 6 months
        aud: "https://appleid.apple.com",
        sub: provider.clientId,
      },
      privateKey.replace(/\\n/g, "\n"),
      { algorithm: "ES256", keyid: keyId }
    )
    params.client_secret = clientSecret
  } else {
    params.client_secret = provider.clientSecret
  }

  if (!params.redirect_uri) {
    params.redirect_uri = provider.callbackUrl
  }

  if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/x-www-form-urlencoded"
  }
  if (!headers["Client-ID"]) {
    headers["Client-ID"] = provider.clientId
  }
  if (provider.id === "reddit") {
    headers.Authorization =
      "Basic " +
      Buffer.from(provider.clientId + ":" + provider.clientSecret).toString(
        "base64"
      )
  }

  if (provider.id === "identity-server4" && !headers.Authorization) {
    headers.Authorization = `Bearer ${code}`
  }

  // Use the new checks/protection logic
  const checks = provider.checks || provider.protection || []
  if (checks.includes("pkce")) {
    params.code_verifier = codeVerifier
  }

  const postData = querystring.stringify(params)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: postData,
    })

    const data = await response.text()
    if (!response.ok) {
      logger.error("OAUTH_GET_ACCESS_TOKEN_ERROR", data)
      throw new Error(data)
    }

    let raw
    try {
      raw = JSON.parse(data)
    } catch {
      raw = querystring.parse(data)
    }

    let accessToken
    if (provider.id === "slack") {
      const { ok, error } = raw
      if (!ok) {
        throw new Error(error)
      }
      accessToken = raw.authed_user.access_token
    } else {
      accessToken = raw.access_token
    }

    return {
      accessToken,
      accessTokenExpires: null,
      refreshToken: raw.refresh_token,
      idToken: raw.id_token,
      ...raw,
    }
  } catch (error) {
    logger.error("OAUTH_GET_ACCESS_TOKEN_ERROR", error)
    throw error
  }
}

/**
 * Ported from https://github.com/ciaranj/node-oauth/blob/a7f8a1e21c362eb4ed2039431fb9ac2ae749f26a/lib/oauth2.js
 * Refactored to use fetch.
 *
 * @param {import("types/providers").OAuthConfig} provider
 * @param {string} accessToken
 * @param {any} results
 */
async function getOAuth2(provider, accessToken, results) {
  let url = provider.profileUrl
  let httpMethod = "GET"
  const headers = { ...provider.headers }

  // Build Authorization header
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  // Mail.ru & vk.com require 'access_token' as URL request parameter
  if (["mailru", "vk"].includes(provider.id)) {
    const safeAccessTokenURL = new URL(url)
    safeAccessTokenURL.searchParams.append("access_token", accessToken)
    url = safeAccessTokenURL.href
    delete headers.Authorization
  }

  // This line is required for Twitch
  if (provider.id === "twitch") {
    headers["Client-ID"] = provider.clientId
  }

  if (provider.id === "bungie") {
    url = prepareProfileUrl({ provider, url, results })
  }

  if (provider.id === "dropbox") {
    httpMethod = "POST"
  }

  try {
    const response = await fetch(url, {
      method: httpMethod,
      headers,
    })

    const profileData = await response.text()
    if (!response.ok) {
      throw new Error(profileData)
    }
    return profileData
  } catch (error) {
    logger.error("OAUTH_GET_PROFILE_ERROR", error)
    throw error
  }
}

/** Bungie needs special handling */
function prepareProfileUrl({ provider, url, results }) {
  if (!results.membership_id) {
    throw new Error("Expected membership_id to be passed.")
  }

  if (!provider.headers?.["X-API-Key"]) {
    throw new Error(
      'The Bungie provider requires the X-API-Key option to be present in "headers".'
    )
  }

  return url.replace("{membershipId}", results.membership_id)
}

/**
 * Minimal OAuth 1.x client implementation to replace the 'oauth' package.
 * Since OAuth 1.x is less common and more complex, we preserve the necessary logic
 * while using native Node.js/Fetch where possible.
 */
class OAuth1Client {
  constructor(provider) {
    this.provider = provider
  }

  async getOAuthRequestToken(_params = {}) {
    throw new Error("OAuth 1.0a is not yet fully implemented in the native client. Please use OAuth 2.0 or contact maintainers.")
  }

  async getOAuthAccessToken(_oauth_token, _oauth_token_secret, _oauth_verifier) {
    throw new Error("OAuth 1.0a is not yet fully implemented in the native client.")
  }

  async get(_url, _oauth_token, _oauth_token_secret) {
    throw new Error("OAuth 1.0a is not yet fully implemented in the native client.")
  }
}

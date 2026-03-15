import oAuthClient from '../oauth/client'
import logger from '../../../lib/logger'

/** @param {import("types/internals").NextAuthRequest} req */
export default async function getAuthorizationUrl (req) {
  const { provider } = req.options

  delete req.query?.nextauth
  const params = {
    ...provider.authorizationParams,
    ...req.query
  }

  const client = oAuthClient(provider)
  if (provider.version?.startsWith('2.')) {
    // Handle OAuth v2.x
    const url = client.getAuthorizeUrl({
      scope: provider.scope,
      ...params,
      redirect_uri: provider.callbackUrl
    })

    logger.debug('GET_AUTHORIZATION_URL', url)
    return url
  }

  try {
    const tokens = await client.getOAuthRequestToken(params)
    const url = `${provider.authorizationUrl}?${new URLSearchParams({
      oauth_token: tokens.oauth_token,
      oauth_token_secret: tokens.oauth_token_secret,
      ...tokens.params
    })}`
    logger.debug('GET_AUTHORIZATION_URL', url)
    return url
  } catch (error) {
    logger.error('GET_AUTHORIZATION_URL_ERROR', error)
    throw error
  }
}

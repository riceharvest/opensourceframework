import type { CookieGetOptions } from 'universal-cookie'
import Cookies from 'universal-cookie'

interface NextCookiesContext {
  req?: {
    headers: {
      cookie?: string
    }
  }
}

// Handle both default import and namespace import for universal-cookie
const UniversalCookie = (Cookies as { default?: typeof Cookies }).default || Cookies

function nextCookies(
  ctx: NextCookiesContext,
  options?: CookieGetOptions
): Record<string, string | undefined> {
  // Note: Next.js Static export sets ctx.req to a fake request with no headers
  const header = ctx?.req?.headers?.cookie
  const uc = new UniversalCookie(header)
  return uc.getAll(options)
}

export default nextCookies

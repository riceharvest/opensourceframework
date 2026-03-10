
import { headers, cookies } from 'next/headers';
import { unsign } from 'cookie-signature';
import { createToken } from './utils/create-token';
import { CsrfErrorCodes } from './types';

export interface VerifyCsrfTokenOptions {
  tokenKey?: string;
  secret?: string;
}

/**
 * Verify CSRF token in App Router (Server Actions or Route Handlers)
 * 
 * @param options - Configuration options
 * @throws Error if CSRF validation fails
 */
export async function verifyCsrfToken(options: VerifyCsrfTokenOptions = {}) {
  const { tokenKey = 'XSRF-TOKEN', secret } = options;
  
  const headersList = await headers();
  const cookiesList = await cookies();
  
  const cookieToken = cookiesList.get(tokenKey)?.value;
  const csrfSecret = cookiesList.get('csrfSecret')?.value;
  
  if (!cookieToken || !csrfSecret) {
    throw new Error('Missing CSRF cookies');
  }
  
  // Get token from headers
  const requestToken = headersList.get(tokenKey.toLowerCase()) || 
                      headersList.get('x-csrf-token') || 
                      headersList.get('x-xsrf-token');
                      
  if (!requestToken) {
    throw new Error('Missing CSRF request token');
  }
  
  let actualCookieToken = cookieToken;
  if (secret) {
    const unsigned = unsign(cookieToken, secret);
    if (!unsigned) throw new Error('Invalid CSRF signature');
    actualCookieToken = unsigned as string;
  }
  
  let actualRequestToken = requestToken;
  if (secret) {
    const unsigned = unsign(requestToken, secret);
    if (unsigned) actualRequestToken = unsigned as string;
  }
  
  if (actualRequestToken !== actualCookieToken) {
    throw new Error('CSRF token mismatch');
  }
  
  if (!createToken.verify(csrfSecret, actualCookieToken)) {
    throw new Error('CSRF verification failed');
  }
}

import type { CookieGetOptions, CookieSetOptions } from 'universal-cookie';
import Cookies from 'universal-cookie';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface NextCookiesContext {
  req?: {
    headers: {
      cookie?: string;
    };
  };
}


const UniversalCookie = (Cookies as { default?: typeof Cookies }).default || Cookies;
const browserCookie = typeof window !== 'undefined' ? new UniversalCookie() : null;


export interface CookieOptions extends CookieGetOptions, CookieSetOptions {}

function nextCookies(
  ctx: NextCookiesContext,
  options?: CookieGetOptions
): Record<string, string | undefined> {
  const header = ctx?.req?.headers?.cookie;
  const uc = new UniversalCookie(header);
  return uc.getAll(options);
}

export { nextCookies as getCookies };

export function useCookies(
  options?: CookieGetOptions
): readonly [
  Record<string, string | undefined>,
  (key: string, value: string, cookieOptions?: CookieSetOptions) => void,
  (key: string, cookieOptions?: CookieSetOptions) => void,
] {
  const isBrowser = () => typeof window !== 'undefined';

  const [cookies, setCookies] = useState<Record<string, string | undefined>>(() => {
    if (!isBrowser()) return {};
    return (browserCookie as Cookies).getAll(options);
  });

  useEffect(() => {
    if (!isBrowser()) return;
    const uc = browserCookie as Cookies;
    const handleChange = () => {
      setCookies(uc.getAll(options));
    };
    uc.addChangeListener(handleChange);
    return () => {
      uc.removeChangeListener(handleChange);
    };
  }, [options]);

  const set = useCallback((key: string, value: string, cookieOptions?: CookieSetOptions) => {
    const uc = isBrowser() ? (browserCookie as Cookies) : new UniversalCookie();
    uc.set(key, value, cookieOptions);
  }, []);

  const remove = useCallback((key: string, cookieOptions?: CookieSetOptions) => {
    const uc = isBrowser() ? (browserCookie as Cookies) : new UniversalCookie();
    uc.remove(key, cookieOptions);
  }, []);

  return useMemo(() => [cookies, set, remove] as const, [cookies, set, remove]);
}

export function useCookie(
  key: string,
  defaultValue?: string,
  options?: CookieSetOptions
): readonly [string | undefined, (value: string) => void, () => void] {
  const [cookies, setCookie, removeCookie] = useCookies();

  const value = cookies[key] !== undefined ? cookies[key] : defaultValue;

  const set = useCallback(
    (newValue: string) => {
      setCookie(key, newValue, options);
    },
    [key, options, setCookie]
  );

  const remove = useCallback(() => {
    removeCookie(key, options);
  }, [key, options, removeCookie]);

  return useMemo(() => [value as string | undefined, set, remove] as const, [value, set, remove]);
}

export default nextCookies;

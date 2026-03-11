import re

with open('src/index.ts', 'r') as f:
    content = f.read()

# Add a shared instance for the browser
shared_instance_code = """
const UniversalCookie = (Cookies as { default?: typeof Cookies }).default || Cookies;
const browserCookie = typeof window !== 'undefined' ? new UniversalCookie() : null;
"""

content = content.replace("const UniversalCookie = (Cookies as { default?: typeof Cookies }).default || Cookies;", shared_instance_code)

# Update useCookies to use the shared instance or a local one
old_use_cookies = """  const [cookies, setCookies] = useState<Record<string, string | undefined>>(() => {
    if (!isBrowser()) return {};
    return new UniversalCookie().getAll(options);
  });

  useEffect(() => {
    const uc = new UniversalCookie();
    const handleChange = () => {
      setCookies(uc.getAll(options));
    };
    uc.addChangeListener(handleChange);
    return () => {
      uc.removeChangeListener(handleChange);
    };
  }, [options]);

  const set = useCallback((key: string, value: string, cookieOptions?: CookieSetOptions) => {
    const uc = new UniversalCookie();
    uc.set(key, value, cookieOptions);
  }, []);

  const remove = useCallback((key: string, cookieOptions?: CookieSetOptions) => {
    const uc = new UniversalCookie();
    uc.remove(key, cookieOptions);
  }, []);"""

new_use_cookies = """  const [cookies, setCookies] = useState<Record<string, string | undefined>>(() => {
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
  }, []);"""

content = content.replace(old_use_cookies, new_use_cookies)

with open('src/index.ts', 'w') as f:
    f.write(content)

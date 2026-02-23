import { expect, vi, test } from "vitest";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { SessionOptions } from "./index.js";
import { getIronSession, sealData } from "./index.js";

const password = "Gbm49ATjnqnkCCCdhV4uDBhbfnPqsCW0";
const cookieName = "test";

interface Data {
  user?: { id: number; meta?: string };
}

const getSession = async (
  req: IncomingMessage | Request,
  res: Response | ServerResponse,
  options: SessionOptions,
) => getIronSession<Data>(req, res, options);

test("should throw if the request parameter is missing", async () => {
  await expect(
    // @ts-expect-error we're verifying JavaScript runtime checks here (DX)
    getSession(),
  ).rejects.toThrow(
    "iron-session: Bad usage: use getIronSession(req, res, options) or getIronSession(cookieStore, options).",
  );
});

test("should throw if the response parameter is missing", async () => {
  await expect(
    // @ts-expect-error we're verifying JavaScript runtime checks here (DX)
    getSession({}),
  ).rejects.toThrow(
    "iron-session: Bad usage: use getIronSession(req, res, options) or getIronSession(cookieStore, options).",
  );
});

test("should throw if the cookie name is missing in options", async () => {
  await expect(
    getSession({} as Request, {} as Response, {} as SessionOptions),
  ).rejects.toThrow(/Missing cookie name/);
});

test("should throw if password is missing in options", async () => {
  await expect(
    getSession({} as Request, {} as Response, { cookieName } as SessionOptions),
  ).rejects.toThrow(/Missing password/);
});

test("should throw if password is less than 32 characters", async () => {
  await expect(
    getSession({} as Request, {} as Response, {
      cookieName,
      password: "123456789012345678901234567890",
    }),
  ).rejects.toThrow(/Password must be at least 32 characters long/);
});

test("should return blank session if no cookie is set", async () => {
  const session = await getSession({ headers: {} } as Request, {} as Response, {
    cookieName,
    password,
  });
  expect(session).toEqual({});
});

test("should set a cookie in the response object on save", async () => {
  const res = {
    getHeader: vi.fn(),
    setHeader: vi.fn(),
  };

  const session = await getSession(
    { headers: {} } as Request,
    res as unknown as ServerResponse,
    {
      cookieName,
      password,
    },
  );
  session.user = { id: 1 };
  await session.save();

  const [name, value] = res.setHeader.mock.calls[0] ?? [];
  expect(name).toBe("set-cookie");
  expect(value[0]).toMatch(
    /^test=.{265}; Max-Age=1209540; Path=\/; HttpOnly; Secure; SameSite=Lax$/,
  );
});

test("should allow deleting then saving session data", async () => {
  const res = { getHeader: vi.fn(), setHeader: vi.fn() };

  let session = await getSession(
    { headers: {} } as Request,
    res as unknown as ServerResponse,
    {
      cookieName,
      password,
    },
  );
  session.user = { id: 1 };
  await session.save();

  let cookie = res.setHeader.mock.calls[0][1][0].split(";")[0];
  session = await getSession(
    { headers: { cookie } } as IncomingMessage,
    res as unknown as ServerResponse,
    {
      cookieName,
      password,
    },
  );
  expect(session).toEqual({ user: { id: 1 } });

  delete session.user;
  await session.save();

  cookie = res.setHeader.mock.calls[1][1][0].split(";")[0];
  session = await getSession(
    { headers: { cookie } } as IncomingMessage,
    res as unknown as ServerResponse,
    {
      cookieName,
      password,
    },
  );
  expect(session).toEqual({});
});

test("should set max-age to a large number if ttl is 0", async () => {
  const res = { getHeader: vi.fn(), setHeader: vi.fn() };

  const session = await getSession(
    { headers: {} } as IncomingMessage,
    res as unknown as ServerResponse,
    {
      cookieName,
      password,
      ttl: 0,
    },
  );
  session.user = { id: 1 };
  await session.save();

  const cookie = res.setHeader.mock.calls[0][1][0];
  expect(cookie).toMatch(/Max-Age=2147483647;/);
});

test("should respect provided max-age in cookie options", async () => {
  const res = { getHeader: vi.fn(), setHeader: vi.fn() };
  const options = { cookieName, password, cookieOptions: { maxAge: 60 } };

  const session = await getSession(
    { headers: {} } as IncomingMessage,
    res as unknown as ServerResponse,
    options,
  );
  session.user = { id: 1 };
  await session.save();

  const cookie = res.setHeader.mock.calls[0][1][0];
  expect(cookie).toMatch(/Max-Age=60;/);
});

test("should not set max-age for session cookies", async () => {
  const res = { getHeader: vi.fn(), setHeader: vi.fn() };
  const options = {
    cookieName,
    password,
    cookieOptions: { maxAge: undefined },
  };

  const session = await getSession(
    { headers: {} } as IncomingMessage,
    res as unknown as ServerResponse,
    options,
  );
  session.user = { id: 1 };
  await session.save();

  const cookie = res.setHeader.mock.calls[0][1][0];
  expect(cookie).not.toMatch(/Max-Age/);
});

test("should expire the cookie on destroying the session", async () => {
  const res = { getHeader: vi.fn(), setHeader: vi.fn() };

  const session = await getSession(
    { headers: {} } as IncomingMessage,
    res as unknown as ServerResponse,
    {
      cookieName,
      password,
    },
  );
  session.user = { id: 1 };
  await session.save();

  let cookie = res.setHeader.mock.calls[0][1][0];
  expect(cookie).toMatch(/Max-Age=1209540;/);

  expect(session).toEqual({ user: { id: 1 } });
  session.destroy();
  expect(session).toEqual({});

  cookie = res.setHeader.mock.calls[1][1][0];
  expect(cookie).toMatch(/Max-Age=0;/);
});

test("should reset the session if the seal is expired", async () => {
  const real = Date.now;
  Date.now = vi.fn(() => 0);

  const seal = await sealData({ user: { id: 1 } }, { password, ttl: 60 });
  const req = {
    headers: { cookie: `${cookieName}=${seal}` },
  } as IncomingMessage;

  let session = await getSession(req, {} as unknown as ServerResponse, {
    cookieName,
    password,
  });
  expect(session).toEqual({ user: { id: 1 } });

  (Date.now as any).mockReturnValue(120_000); // = ttl + 60s skew

  session = await getSession(req, {} as unknown as ServerResponse, {
    cookieName,
    password,
  });
  expect(session).toEqual({});

  Date.now = real;
});

test("should refresh the session (ttl, max-age) on save", async () => {
  const res = { getHeader: vi.fn(), setHeader: vi.fn() };
  const options = { cookieName, password, ttl: 61 };

  const real = Date.now;
  Date.now = vi.fn(() => 0);

  let session = await getSession(
    { headers: {} } as IncomingMessage,
    res as unknown as ServerResponse,
    options,
  );
  session.user = { id: 1 };
  await session.save();

  let cookie = res.setHeader.mock.calls[0][1][0];
  expect(cookie).toMatch(/Max-Age=1;/);

  (Date.now as any).mockReturnValue(120_000); // < ttl + 60s skew

  session = await getSession(
    { headers: { cookie: cookie.split(";")[0] } } as IncomingMessage,
    res as unknown as ServerResponse,
    options,
  );
  expect(session).toEqual({ user: { id: 1 } });

  await session.save(); // session is now valid for another ttl + 60s

  cookie = res.setHeader.mock.calls[1][1][0];
  expect(cookie).toMatch(/Max-Age=1;/); // max-age is relative to the current time

  (Date.now as any).mockReturnValue(240_000); // < earlier time + ttl + 60s skew

  session = await getSession(
    { headers: { cookie: cookie.split(";")[0] } } as IncomingMessage,
    res as unknown as ServerResponse,
    options,
  );
  expect(session).toEqual({ user: { id: 1 } }); // session is still valid
  // if ttl wasn't refreshed, session would have been reset to {}

  Date.now = real;
});

test("should reset the session if password is changed", async () => {
  const firstPassword = password;
  const secondPassword = "12345678901234567890123456789012";

  const seal = await sealData({ user: { id: 1 } }, { password: firstPassword });
  const req = { headers: { cookie: `${cookieName}=${seal}` } };

  const session = await getSession(
    req as IncomingMessage,
    {} as unknown as ServerResponse,
    { cookieName, password: secondPassword },
  );
  expect(session).toEqual({});
});

test("should decrypt cookie generated from older password", async () => {
  const firstPassword = password;
  const secondPassword = "12345678901234567890123456789012";

  const seal = await sealData({ user: { id: 1 } }, { password: firstPassword });
  const req = { headers: { cookie: `${cookieName}=${seal}` } };

  const passwords = { 2: secondPassword, 1: firstPassword }; // rotation
  const session = await getSession(
    req as IncomingMessage,
    {} as unknown as ServerResponse,
    { cookieName, password: passwords },
  );
  expect(session).toEqual({ user: { id: 1 } });
});

test("should throw if the cookie length is too big", async () => {
  const res = { getHeader: vi.fn(), setHeader: vi.fn() };

  const session = await getSession(
    { headers: {} } as IncomingMessage,
    res as unknown as ServerResponse,
    {
      cookieName,
      password,
    },
  );
  session.user = { id: 1, meta: "0".repeat(3000) };
  await expect(session.save()).rejects.toThrow(/Cookie length is too big/);
});

test("should throw if trying to save after headers are sent", async () => {
  const session = await getSession(
    { headers: {} } as IncomingMessage,
    { headersSent: true } as unknown as Response,
    { cookieName, password },
  );
  session.user = { id: 1 };

  await expect(session.save()).rejects.toThrow(
    /session.save\(\) was called after headers were sent/,
  );
});

test("should keep previously set cookie - single", async () => {
  const existingCookie = "existing=cookie";
  const res = {
    getHeader: vi.fn(() => existingCookie),
    setHeader: vi.fn(),
  };

  const session = await getSession(
    { headers: {} } as IncomingMessage,
    res as unknown as Response,
    {
      cookieName,
      password,
    },
  );
  session.user = { id: 1 };
  await session.save();

  let cookies = res.setHeader.mock.calls[0][1];
  expect(cookies[0]).toBe(existingCookie);
  expect(cookies.length).toBe(2);

  session.destroy();

  cookies = res.setHeader.mock.calls[1][1];
  expect(cookies[0]).toBe(existingCookie);
  expect(cookies[1]).toBe(
    `${cookieName}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`,
  );
});

test("should keep previously set cookies - multiple", async () => {
  const existingCookies = ["existing=cookie", "existing2=cookie2"];
  const res = {
    getHeader: vi.fn(() => existingCookies),
    setHeader: vi.fn(),
  };

  const session = await getSession(
    { headers: {} } as Request,
    res as unknown as Response,
    {
      cookieName,
      password,
    },
  );
  session.user = { id: 1 };
  await session.save();

  let cookies = res.setHeader.mock.calls[0][1];
  expect(cookies[0]).toBe(existingCookies[0]);
  expect(cookies[1]).toBe(existingCookies[1]);
  expect(cookies.length).toBe(3);

  session.destroy();

  cookies = res.setHeader.mock.calls[1][1];
  expect(cookies[0]).toBe(existingCookies[0]);
  expect(cookies[1]).toBe(existingCookies[1]);
  expect(cookies[2]).toBe(
    `${cookieName}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`,
  );
});

test("should be backwards compatible with older cookie format", async () => {
  // this seal is in the old next-iron-session format (generated with ttl: 0)
  const cookie = `${cookieName}=Fe26.2*1*1e2bacee1edffaeb4a9ba4a07dc36c2c60d20415a60ac1b901033af1f107ead5*LAC9Fn3BJ9ifKMhVL3pP5w*JHhcByIzk4ThLt9rUW-fDMrOwUT7htHy1uyqeOTIqrVwDJ0Bz7TOAwIz_Cos-ug3**7dfa11868bbcc4f7e118342c0280ff49ba4a7cc84c70395bbc3d821a5f460174*6a8FkHxdg322jyym6PwJf3owz7pd6nq5ZIzyLHGVC0c`;

  const session = await getSession(
    { headers: { cookie } } as IncomingMessage,
    {} as Response,
    { cookieName, password },
  );
  expect(session).toEqual({ user: { id: 77 } });
});

test("should prevent reassignment of save/destroy functions", async () => {
  const session = await getSession(
    { headers: {} } as IncomingMessage,
    {} as Response,
    { cookieName, password },
  );

  await expect(async () => {
    // @ts-expect-error Runtime check
    session.save = () => {};
  }).rejects.toThrow(/Cannot assign to read only property 'save' of object '#<Object>'/);

  await expect(async () => {
    // @ts-expect-error Runtime check
    session.destroy = () => {};
  }).rejects.toThrow(/Cannot assign to read only property 'destroy' of object '#<Object>'/);
});

test("allow to update session configuration", async () => {
  const res = {
    getHeader: vi.fn(),
    setHeader: vi.fn(),
  };

  const session = await getSession(
    { headers: {} } as IncomingMessage,
    res as unknown as ServerResponse,
    {
      cookieName,
      password,
    },
  );
  session.user = { id: 1 };

  session.updateConfig({ ttl: 61, cookieName: "test2", password: "ok" });

  await session.save();
  expect(res.setHeader.mock.calls[0][1][0]).toMatch(/Max-Age=1;/);
});

test("should work with standard web Request/Response APIs", async () => {
  const req = new Request("https://example.com");
  const res = new Response("Hello, world!");

  let session = await getSession(req, res, { cookieName, password });
  expect(session).toEqual({});

  session.user = { id: 1 };
  await session.save();

  const cookie = res.headers.get("set-cookie") ?? "";
  expect(cookie).toMatch(
    /^test=.{265}; Max-Age=1209540; Path=\/; HttpOnly; Secure; SameSite=Lax$/,
  );

  req.headers.set("cookie", cookie.split(";")[0] ?? "");
  session = await getSession(req, res, { cookieName, password });
  expect(session).toEqual({ user: { id: 1 } });
});

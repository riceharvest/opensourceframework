import c from "cookie";
import { ServerResponse } from "http";
import { Options, Session, SessionData } from "./types";

export function hash(sess: SessionData) {
  return JSON.stringify(sess, (key, val) =>
    key === "cookie" ? undefined : val
  );
}

export function parseTime(time: number | string): number {
  if (typeof time === "number") return time;
  const trimmed = time.trim();
  if (!trimmed) return 0;
  const unit = trimmed.slice(-1);
  const value = parseInt(trimmed.slice(0, -1), 10);
  switch (unit) {
    case "s":
      return Number.isFinite(value) ? value : 0;
    case "m":
      return Number.isFinite(value) ? value * 60 : 0;
    case "h":
      return Number.isFinite(value) ? value * 60 * 60 : 0;
    case "d":
      return Number.isFinite(value) ? value * 60 * 60 * 24 : 0;
    default: {
      const parsed = parseInt(trimmed, 10);
      return Number.isFinite(parsed) ? parsed : 0;
    }
  }
}

export function commitHeader(
  res: ServerResponse,
  name: string,
  session: Pick<Session, "cookie" | "id">,
  encodeFn?: Options["encode"]
) {
  if (res.headersSent) return;
  const { cookie, id } = session;
  const cookieStr = c.serialize(name, encodeFn ? encodeFn(id) : id, {
    path: cookie.path,
    httpOnly: cookie.httpOnly,
    maxAge: cookie.maxAge,
    expires: cookie.expires,
    domain: cookie.domain,
    sameSite: cookie.sameSite,
    secure: cookie.secure,
  });

  const prevSetCookie = res.getHeader("set-cookie");

  if (prevSetCookie) {
    if (Array.isArray(prevSetCookie)) {
      res.setHeader("set-cookie", [...prevSetCookie, cookieStr]);
    } else {
      res.setHeader("set-cookie", [prevSetCookie as string, cookieStr]);
    }
  } else {
    res.setHeader("set-cookie", cookieStr);
  }
}

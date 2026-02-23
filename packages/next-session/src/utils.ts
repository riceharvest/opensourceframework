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
  // This is a simple implementation, you might want to use a library like `ms`
  // but for now let's just support seconds as numbers.
  return parseInt(time, 10);
}

export function commitHeader(
  res: ServerResponse,
  name: string,
  session: Session,
  encodeFn?: Options["encode"]
) {
  if (res.headersSent) return;
  const cookieStr = c.serialize(name, encodeFn ? encodeFn(session.id) : session.id, session.cookie);

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

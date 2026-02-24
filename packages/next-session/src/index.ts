import { IncomingMessage, ServerResponse } from "http";
import { nanoid } from "nanoid";
import { parse } from "cookie";
import { isDestroyed, isNew, isTouched } from "./symbol";
import MemoryStore from "./memory-store";
import { hash, parseTime, commitHeader } from "./utils";
import { Options, Session, SessionRecord } from "./types";

export default function nextSession<T extends SessionRecord = SessionRecord>(
  options: Options = {}
) {
  const name = options.name || "sid";
  const store = options.store || new MemoryStore();
  const genid = options.genid || (() => nanoid());
  const encode = options.encode;
  const decode = options.decode;
  const touchAfter =
    options.touchAfter !== undefined ? parseTime(options.touchAfter) : -1;
  const cookieOptions = options.cookie || {};
  const autoCommit =
    options.autoCommit !== undefined ? options.autoCommit : true;

  type TypedSession = Session<T>;

  function decorateSession(
    req: IncomingMessage,
    res: ServerResponse,
    session: TypedSession,
    sessionId: string,
    now: number
  ) {
    Object.defineProperties(session, {
      id: { value: sessionId, enumerable: true, writable: true },
      touch: {
        value: function touch() {
          this.cookie.expires = new Date(now + (this.cookie.maxAge || 0) * 1000);
          this[isTouched] = true;
        },
        enumerable: false,
      },
      destroy: {
        value: function destroy() {
          this[isDestroyed] = true;
          delete (req as unknown as { session: TypedSession }).session;
          this.cookie.maxAge = -1;
          this.cookie.expires = new Date(0);
          commitHeader(res, name, this, encode);
          return store.destroy(this.id);
        },
        enumerable: false,
      },
      commit: {
        value: async function commit() {
          await commitHeader(res, name, this, encode);
          await store.set(this.id, this);
        },
        enumerable: false,
      },
    });
  }

  return async function getSession(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<TypedSession> {
    if ((req as unknown as { session: TypedSession }).session) return (req as unknown as { session: TypedSession }).session;

    const _now = Date.now();

    const cookies = parse(req.headers?.cookie || "");
    const rawSid = cookies[name];
    const sessionId = rawSid ? (decode ? decode(rawSid) : rawSid) : null;

    const _session = sessionId ? await store.get(sessionId) : null;

    let session: TypedSession;
    if (_session) {
      session = _session as TypedSession;
      // Some store return cookie.expires as string, convert it to Date
      if (typeof (session.cookie as unknown as { expires: unknown }).expires === "string") {
        (session.cookie as unknown as { expires: unknown }).expires = new Date((session.cookie as unknown as { expires: unknown }).expires);
      }

      // Add session methods
      decorateSession(req, res, session, sessionId as string, _now);

      // Extends the expiry of the session if options.touchAfter is sastified
      if (touchAfter >= 0 && session.cookie.expires && session.cookie.maxAge) {
        const lastTouchedTime =
          session.cookie.expires.getTime() - session.cookie.maxAge * 1000;
        if (_now - lastTouchedTime >= touchAfter * 1000) session.touch();
      }
    } else {
      const newSessionId = genid();
      session = {
        cookie: {
          path: cookieOptions.path || "/",
          httpOnly:
            cookieOptions.httpOnly !== undefined
              ? cookieOptions.httpOnly
              : true,
          domain: cookieOptions.domain,
          sameSite: cookieOptions.sameSite,
          secure: cookieOptions.secure || false,
          maxAge: cookieOptions.maxAge,
          expires: cookieOptions.maxAge
            ? new Date(_now + cookieOptions.maxAge * 1000)
            : undefined,
        },
      } as TypedSession;
      (session as unknown as { [isNew]: boolean })[isNew] = true;
      decorateSession(req, res, session, newSessionId, _now);
    }

    const prevHash = hash(session);

    if (autoCommit) {
      const _writeHead = res.writeHead;
      res.writeHead = function resWriteHeadProxy(...args: unknown[]) {
        if (!res.headersSent && (session[isTouched] || (session[isNew] && hash(session) !== prevHash))) {
          commitHeader(res, name, session, encode);
        }
        return _writeHead.apply(this, args as unknown[]);
      };
      const _end = res.end;
      res.end = function resEndProxy(...args: unknown[]) {
        const done = () => _end.apply(this, args as unknown[]);
        if (session[isDestroyed]) {
          return done();
        } else if (hash(session) !== prevHash) {
          store.set(session.id, session).finally(done);
        } else if (session[isTouched] && store.touch) {
          store.touch(session.id, session).finally(done);
        } else {
          return done();
        }
        return this as unknown as ServerResponse;
      };
    }

    (req as unknown as { session: TypedSession }).session = session;

    return session;
  };
}

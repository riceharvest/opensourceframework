import { IncomingMessage, ServerResponse } from "http";
import { nanoid } from "nanoid";
import { parse } from "cookie";
import { isDestroyed, isNew, isTouched } from "./symbol";
import MemoryStore from "./memory-store";
import { hash, parseTime, commitHeader } from "./utils";
import { Options, Session, SessionRecord, SessionData, SessionStore } from "./types";

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
          if ((this as any).cookie.maxAge) {
            (this as any).cookie.expires = new Date(now + (this as any).cookie.maxAge * 1000);
          }
          (this as any)[isTouched] = true;
        },
        enumerable: false,
      },
      destroy: {
        value: function destroy() {
          (this as any)[isDestroyed] = true;
          // @ts-expect-error - legacy compat typing
          delete req.session;
          (this as any).cookie.maxAge = -1;
          (this as any).cookie.expires = new Date(0);
          commitHeader(res, name, this as any, encode);
          return store.destroy((this as any).id);
        },
        enumerable: false,
      },
      commit: {
        value: async function commit() {
          await commitHeader(res, name, this as any, encode);
          await store.set((this as any).id, this as any);
        },
        enumerable: false,
      },
    });
  }

  return async function getSession(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<TypedSession> {
    // @ts-expect-error - legacy compat typing
    if (req.session) return req.session;

    const _now = Date.now();

    const cookies = parse(req.headers?.cookie || "");
    const rawSid = cookies[name];
    const sessionId = rawSid ? (decode ? decode(rawSid) : rawSid) : null;

    const _session = sessionId ? await store.get(sessionId) : null;

    let session: TypedSession;
    if (_session) {
      session = _session as TypedSession;
      // Some store return cookie.expires as string, convert it to Date
      if (typeof (session.cookie as any).expires === "string") {
        (session.cookie as any).expires = new Date((session.cookie as any).expires);
      }

      // Add session methods
      decorateSession(req, res, session, sessionId as string, _now);

      // Extends the expiry of the session if options.touchAfter is sastified
      if (touchAfter >= 0 && (session.cookie as any).expires && (session.cookie as any).maxAge) {
        const lastTouchedTime =
          (session.cookie as any).expires.getTime() - (session.cookie as any).maxAge * 1000;
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
      (session as any)[isNew] = true;
      decorateSession(req, res, session, newSessionId, _now);
    }

    const prevHash = hash(session);

    if (autoCommit) {
      const _writeHead = res.writeHead;
      res.writeHead = function resWriteHeadProxy(
        this: ServerResponse,
        statusCode: number,
        ...args: any[]
      ) {
        if (!this.headersSent && (session[isTouched] || (session[isNew] && hash(session) !== prevHash))) {
          commitHeader(this, name, session, encode);
        }
        return _writeHead.apply(this, [statusCode, ...args] as any);
      } as any;
      const _end = res.end;
      res.end = function resEndProxy(this: ServerResponse, ...args: any[]) {
        const done = () => _end.apply(this, args as any);
        if (session[isDestroyed]) {
          return done();
        } else if (hash(session) !== prevHash) {
          store.set(session.id, session).finally(done);
        } else if (session[isTouched] && store.touch) {
          store.touch(session.id, session).finally(done);
        } else {
          return done();
        }
        return this;
      } as any;
    }

    // @ts-expect-error - legacy compat typing
    req.session = session;

    return session;
  };
}

export type { Options, SessionData, SessionStore, Session };

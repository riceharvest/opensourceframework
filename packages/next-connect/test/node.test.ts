import { IncomingMessage, ServerResponse } from "http";
import { describe, test, expect, vi } from "vitest";
import { createRouter, getPathname, NodeRouter } from "../src/node.js";
import { Router } from "../src/router.js";

type AnyHandler = (...args: any[]) => any;

const noop: AnyHandler = async () => {
  /** noop */
};

const METHODS = ["GET", "HEAD", "PATCH", "DELETE", "POST", "PUT"];

describe("NodeRouter", () => {
  test("internals", () => {
    const ctx = new NodeRouter();
    expect(ctx).toBeInstanceOf(NodeRouter);
    // @ts-expect-error: internal
    expect(ctx.router).toBeInstanceOf(Router);

    expect(typeof ctx.all).toBe("function");
    METHODS.forEach((str) => {
      expect(typeof ctx[str.toLowerCase() as keyof NodeRouter]).toBe("function");
    });
  });

  test("createRouter() returns an instance", async () => {
    expect(createRouter()).toBeInstanceOf(NodeRouter);
  });

  test("add()", async () => {
    const ctx = new NodeRouter();
    // @ts-expect-error: private property
    const routerAddStub = vi.spyOn(ctx.router, "add");
    // @ts-expect-error: private property
    const returned = ctx.add("GET", "/", noop);
    expect(routerAddStub).toHaveBeenCalledWith("GET", "/", noop);
    expect(returned).toBe(ctx);
  });

  describe("use()", () => {
    test("it defaults to / if base is not provided", async () => {
      const ctx = new NodeRouter();
      // @ts-expect-error: private field
      const useSpy = vi.spyOn(ctx.router, "use");
      ctx.use(noop);
      expect(useSpy).toHaveBeenCalledWith("/", noop);
    });

    test("it call this.router.use() with fn", async () => {
      const ctx = new NodeRouter();
      // @ts-expect-error: private field
      const useSpy = vi.spyOn(ctx.router, "use");
      ctx.use("/test", noop, noop);
      expect(useSpy).toHaveBeenCalledWith("/test", noop, noop);
    });

    test("it call this.router.use() with fn.router", async () => {
      const ctx = new NodeRouter();
      const ctx2 = new NodeRouter();
      // @ts-expect-error: private field
      const useSpy = vi.spyOn(ctx.router, "use");
      ctx.use("/test", ctx2, ctx2);
      // @ts-expect-error: private field
      expect(useSpy).toHaveBeenCalledWith("/test", ctx2.router, ctx2.router);
    });
  });

  test("clone()", () => {
    const ctx = new NodeRouter();
    // @ts-expect-error: private property
    ctx.router.routes = [noop, noop] as any[];
    const cloned = ctx.clone();
    expect(cloned).toBeInstanceOf(NodeRouter);
    expect(ctx).not.toBe(cloned);
    // @ts-expect-error: private property
    expect(ctx.router).not.toBe(cloned.router);
    // @ts-expect-error: private property
    expect(ctx.router.routes).not.toBe(cloned.router.routes);
    // @ts-expect-error: private property
    expect(ctx.router.routes).toEqual(cloned.router.routes);
  });

  test("run() - runs req and res through fns and return last value", async () => {
    const ctx = createRouter();
    const req = { url: "/foo/bar", method: "POST" } as IncomingMessage;
    const res = {} as ServerResponse;
    
    ctx.use("/", (reqq, ress, next) => {
      expect(reqq).toBe(req);
      expect(ress).toBe(res);
      return next();
    });
    
    ctx.post("/foo/bar", async (reqq, ress, next) => {
      expect(reqq).toBe(req);
      expect(ress).toBe(res);
      return next();
    });
    
    ctx.use("/foo", (reqq, ress) => {
      expect(reqq).toBe(req);
      expect(ress).toBe(res);
      return "ok";
    });
    
    expect(await ctx.run(req, res)).toBe("ok");
  });

  test("run() - propagates error", async () => {
    const req = { url: "/", method: "GET" } as IncomingMessage;
    const res = {} as ServerResponse;
    const err = new Error("💥");
    
    await expect(
      createRouter()
        .use((_, __, next) => {
          next();
        })
        .use(() => {
          throw err;
        })
        .run(req, res)
    ).rejects.toThrow(err);

    await expect(
      createRouter()
        .use((_, __, next) => {
          return next();
        })
        .use(async () => {
          throw err;
        })
        .run(req, res)
    ).rejects.toThrow(err);

    await expect(
      createRouter()
        .use((_, __, next) => {
          return next();
        })
        .use(async (_, __, next) => {
          await next();
        })
        .use(() => Promise.reject(err))
        .run(req, res)
    ).rejects.toThrow(err);
  });

  test("run() - returns if no fns", async () => {
    const req = { url: "/foo/bar", method: "GET" } as IncomingMessage;
    const res = {} as ServerResponse;
    const ctx = createRouter();
    ctx.get("/foo", noop);
    expect(await ctx.run(req, res)).toBeUndefined();
  });

  test("handler() - handles incoming (sync)", async () => {
    let i = 0;
    const req = { method: "GET", url: "/" } as IncomingMessage;
    const res = {} as ServerResponse;
    await createRouter()
      .use((req, res, next) => {
        expect(++i).toBe(1);
        next();
      })
      .use((req, res, next) => {
        expect(++i).toBe(2);
        next();
      })
      .get("/", () => {
        expect(++i).toBe(3);
      })
      .handler()(req, res);
    expect(i).toBe(3);
  });

  test("handler() - handles incoming (async)", async () => {
    let i = 0;
    const req = { method: "GET", url: "/" } as IncomingMessage;
    const res = {} as ServerResponse;
    await createRouter()
      .use(async (req, res, next) => {
        expect(++i).toBe(1);
        await next();
      })
      .use((req, res, next) => {
        expect(++i).toBe(2);
        return next();
      })
      .get("/", async () => {
        expect(++i).toBe(3);
      })
      .handler()(req, res);
    expect(i).toBe(3);
  });

  test("handler() - calls onError if error thrown (sync)", async () => {
    const error = new Error("💥");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const req = { method: "GET", url: "/" } as IncomingMessage;
    const endSpy = vi.fn();
    const res = {
      end: endSpy,
      statusCode: 200
    } as unknown as ServerResponse;

    await createRouter()
      .get("/", () => {
        throw error;
      })
      .handler()(req, res);
    
    expect(res.statusCode).toBe(500);
    expect(endSpy).toHaveBeenCalledWith("Internal Server Error");
    expect(consoleSpy).toHaveBeenCalledWith(error);
    consoleSpy.mockRestore();
  });

  test("handler() - calls custom onError", async () => {
    const req = { method: "GET", url: "/" } as IncomingMessage;
    const res = {} as ServerResponse;
    const onError = vi.fn();
    
    await createRouter()
      .get("/", () => {
        throw new Error("💥");
      })
      .handler({ onError })(req, res);
      
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0].message).toBe("💥");
  });

  test("handler() - calls onNoMatch if no fns matched", async () => {
    const req = { url: "/foo/bar", method: "GET" } as IncomingMessage;
    const endSpy = vi.fn();
    const res = {
      end: endSpy,
      statusCode: 200
    } as unknown as ServerResponse;
    
    await createRouter().get("/foo", noop).handler()(req, res);
    expect(res.statusCode).toBe(404);
    expect(endSpy).toHaveBeenCalledWith("Route GET /foo/bar not found");
  });

  test("prepareRequest() - attach params", async () => {
    const req = {} as any;
    const ctx = createRouter().get("/hello/:name", noop);
    // @ts-expect-error: internal
    ctx.prepareRequest(
      req,
      {} as ServerResponse,
      // @ts-expect-error: internal
      ctx.router.find("GET", "/hello/world")
    );
    expect(req.params).toEqual({ name: "world" });
  });

  test("getPathname() - returns pathname correctly", () => {
    expect(getPathname("/foo/bar")).toBe("/foo/bar");
    expect(getPathname("/foo/bar?q=quz")).toBe("/foo/bar");
  });
});

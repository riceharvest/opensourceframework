/**
 * Adapted from lukeed/trouter library:
 * https://github.com/lukeed/trouter/blob/master/test/index.js
 */
import { describe, test, expect, vi } from "vitest";
import type { Route } from "../src/router.js";
import { Router } from "../src/router.js";
import type { HttpMethod, Nextable } from "../src/types.js";

type AnyHandler = (...args: any[]) => any;

const noop: AnyHandler = async () => {
  /** noop */
};

const testRoute = (
  rr: Route<any>,
  { route, ...match }: Partial<Route<any> & { route: string }>
) => {
  // @ts-expect-error: pattern does not always exist
  const { pattern, ...r } = rr;
  expect(r).toEqual(match);
  if (route) {
    const testCtx = new Router();
    testCtx.routes = [rr];
    expect(testCtx.find(match.method as HttpMethod, route).fns.length).toBeGreaterThan(0);
  }
};

describe("Router", () => {
  test("internals", () => {
    const ctx = new Router<AnyHandler>();
    expect(ctx).toBeInstanceOf(Router);
    expect(Array.isArray(ctx.routes)).toBe(true);
    expect(typeof ctx.add).toBe("function");
    expect(typeof ctx.find).toBe("function");
  });

  test("add()", () => {
    const ctx = new Router<AnyHandler>();

    const out = ctx.add("GET", "/foo/:hello", noop);
    expect(out).toBe(ctx);

    expect(ctx.routes.length).toBe(1);

    testRoute(ctx.routes[0], {
      fns: [noop],
      method: "GET",
      isMiddle: false,
      keys: ["hello"],
      route: "/foo/bar",
    });

    ctx.add("POST", "bar", noop);
    expect(ctx.routes.length).toBe(2);

    testRoute(ctx.routes[1], {
      fns: [noop],
      keys: [],
      method: "POST",
      isMiddle: false,
      route: "/bar",
    });

    ctx.add("PUT", /^[/]foo[/](?<hello>\w+)[/]?$/, noop);
    expect(ctx.routes.length).toBe(3);

    testRoute(ctx.routes[2], {
      fns: [noop],
      keys: false,
      method: "PUT",
      isMiddle: false,
    });
  });

  test("add() - multiple", () => {
    const ctx = new Router<AnyHandler>();

    ctx.add("PATCH", "/foo/:hello", noop, noop);
    expect(ctx.routes.length).toBe(1);

    testRoute(ctx.routes[0], {
      fns: [noop, noop],
      keys: ["hello"],
      method: "PATCH",
      route: "/foo/howdy",
      isMiddle: false,
    });

    ctx.add("PUT", "/bar", noop, noop, noop);
    expect(ctx.routes.length).toBe(2);

    testRoute(ctx.routes[1], {
      fns: [noop, noop, noop],
      keys: [],
      method: "PUT",
      route: "/bar",
      isMiddle: false,
    });
  });

  test("use()", () => {
    const ctx = new Router<AnyHandler>();

    const out = ctx.use("/foo/:hello", noop);
    expect(out).toBe(ctx);

    expect(ctx.routes.length).toBe(1);

    testRoute(ctx.routes[0], {
      method: "",
      keys: ["hello"],
      route: "/foo/bar",
      fns: [noop],
      isMiddle: true,
    });

    ctx.use("/", noop, noop, noop);
    expect(ctx.routes.length).toBe(2);

    testRoute(ctx.routes[1], {
      keys: [],
      method: "",
      route: "/",
      fns: [noop, noop, noop],
      isMiddle: true,
    });

    ctx.use("/foo/:world?", noop, noop, noop, noop);
    expect(ctx.routes.length).toBe(3);

    testRoute(ctx.routes[2], {
      keys: ["world"],
      method: "",
      route: "/foo/hello",
      fns: [noop, noop, noop, noop],
      isMiddle: true,
    });
  });

  test("all()", () => {
    const fn: AnyHandler = (req: any) => req.chain++;
    const ctx = new Router<AnyHandler>().add("", "/greet/:name", fn);
    expect(ctx.routes.length).toBe(1);

    testRoute(ctx.routes[0], {
      method: "", // ~> "ALL"
      keys: ["name"],
      route: "/greet/you",
      fns: [fn],
      isMiddle: false,
    });

    const foo = ctx.find("HEAD", "/greet/Bob") as any;
    expect(foo.params.name).toBe("Bob");
    expect(foo.fns.length).toBe(1);

    foo.chain = 0;
    foo.fns.forEach((fn: any) => fn(foo));
    expect(foo.chain).toBe(1);

    const bar = ctx.find("GET", "/greet/Judy") as any;
    expect(bar.params.name).toBe("Judy");
    expect(bar.fns.length).toBe(1);

    bar.chain = 0;
    bar.fns.forEach((fn: any) => fn(bar));
    expect(bar.chain).toBe(1);

    const fn2: AnyHandler = (req: any) => {
      expect(req.chain++).toBe(1);
      expect(req.params.name).toBe("Rick");
      expect(req.params.person).toBe("Rick");
    };
    ctx.add("HEAD", "/greet/:person", fn2);

    expect(ctx.routes.length).toBe(2);

    testRoute(ctx.routes[1], {
      method: "HEAD", 
      keys: ["person"],
      route: "/greet/you",
      fns: [fn2],
      isMiddle: false,
    });

    const baz = ctx.find("HEAD", "/greet/Rick") as any;
    expect(baz.params.name).toBe("Rick");
    expect(baz.fns.length).toBe(2);

    baz.chain = 0;
    baz.fns.forEach((fn: any) => fn(baz));
    expect(baz.chain).toBe(2);

    const bat = ctx.find("POST", "/greet/Morty") as any;
    expect(bat.params.name).toBe("Morty");
    expect(bat.fns.length).toBe(1);

    bat.chain = 0;
    bat.fns.forEach((fn: any) => fn(bat));
    expect(bat.chain).toBe(1);
  });

  test("find()", () => {
    const ctx = new Router<AnyHandler>();

    ctx.add(
      "GET",
      "/foo/:title",
      ((req: any) => {
        expect(req.chain++).toBe(1);
        expect(req.params.title).toBe("bar");
      }) as AnyHandler,
      ((req: any) => {
        expect(req.chain++).toBe(2);
      }) as AnyHandler
    );

    const out = ctx.find("GET", "/foo/bar") as any;

    expect(typeof out).toBe("object");
    expect(typeof out.params).toBe("object");
    expect(out.params.title).toBe("bar");

    expect(Array.isArray(out.fns)).toBe(true);
    expect(out.fns.length).toBe(2);

    out.chain = 1;
    out.fns.forEach((fn: any) => fn(out));
    expect(out.chain).toBe(3);
  });

  test("find() - no match", () => {
    const ctx = new Router<AnyHandler>();
    const out = ctx.find("DELETE", "/nothing");

    expect(typeof out).toBe("object");
    expect(Object.keys(out.params).length).toBe(0);
    expect(out.fns.length).toBe(0);
  });

  test("find() - multiple", () => {
    let isRoot = true;
    const ctx = new Router<AnyHandler>()
      .use("/foo", ((req: any) => {
        if (!isRoot) expect(req.params.title).toBe("bar");
        expect(req.chain++).toBe(0);
      }) as AnyHandler)
      .add("GET", "/foo", ((req: any) => {
        expect(req.chain++).toBe(1);
      }) as AnyHandler)
      .add("GET", "/foo/:title?", ((req: any) => {
        if (!isRoot) expect(req.params.title).toBe("bar");
        if (isRoot) {
          expect(req.chain++).toBe(2);
        } else {
          expect(req.chain++).toBe(1);
        }
      }) as AnyHandler)
      .add("GET", "/foo/*", ((req: any) => {
        expect(req.params.wild).toBe("bar");
        expect(req.params.title).toBe("bar");
        expect(req.chain++).toBe(2);
      }) as AnyHandler);

    isRoot = true;
    const foo = ctx.find("GET", "/foo") as any;
    expect(foo.fns.length).toBe(3);

    foo.chain = 0;
    foo.fns.forEach((fn: any) => fn(foo));

    isRoot = false;
    const bar = ctx.find("GET", "/foo/bar") as any;
    expect(bar.fns.length).toBe(3);

    bar.chain = 0;
    bar.fns.forEach((fn: any) => fn(bar));
  });

  test("find() - ORDER Order", () => {
    const ctx = new Router<AnyHandler>()
      .add("", "/foo", ((req: any) => {
        expect(req.chain++).toBe(0);
      }) as AnyHandler)
      .add("GET", "/foo", ((req: any) => {
        expect(req.chain++).toBe(1);
      }) as AnyHandler)
      .add("HEAD", "/foo", ((req: any) => {
        expect(req.chain++).toBe(2);
      }) as AnyHandler)
      .add("GET", "/", (() => {
        // should not run
      }) as AnyHandler);

    const out = ctx.find("HEAD", "/foo") as any;
    expect(out.fns.length).toBe(3);

    out.chain = 0;
    out.fns.forEach((fn: any) => fn(out));
    expect(out.chain).toBe(3);
  });

  test("find() w/ use()", () => {
    const noop = () => {};
    const find = (x: any, y: any) => x.find("GET", y);

    const ctx1 = new Router<AnyHandler>().use("api", noop);
    const ctx2 = new Router<AnyHandler>().use("api/:version", noop);
    const ctx3 = new Router<AnyHandler>().use("api/:version?", noop);
    const ctx4 = new Router<AnyHandler>().use("movies/:title.mp4", noop);

    expect(find(ctx1, "/api").fns.length).toBe(1);
    expect(find(ctx1, "/api/foo").fns.length).toBe(1);

    expect(find(ctx2, "/api").fns.length).toBe(0);

    const foo1 = find(ctx2, "/api/v1");
    expect(foo1.fns.length).toBe(1);
    expect(foo1.params.version).toBe("v1");

    const foo2 = find(ctx2, "/api/v1/users");
    expect(foo2.fns.length).toBe(1);
    expect(foo2.params.version).toBe("v1");

    expect(find(ctx3, "/api").fns.length).toBe(1);

    const bar1 = find(ctx3, "/api/v1");
    expect(bar1.fns.length).toBe(1);
    expect(bar1.params.version).toBe("v1");

    const bar2 = find(ctx3, "/api/v1/users");
    expect(bar2.fns.length).toBe(1);
    expect(bar2.params.version).toBe("v1");

    expect(find(ctx4, "/movies").fns.length).toBe(0);
    expect(find(ctx4, "/movies/narnia").fns.length).toBe(0);

    const baz1 = find(ctx4, "/movies/narnia.mp4");
    expect(baz1.fns.length).toBe(1);
    expect(baz1.params.title).toBe("narnia");

    const baz2 = find(ctx4, "/movies/narnia.mp4/cast");
    expect(baz2.fns.length).toBe(1);
    expect(baz2.params.title).toBe("narnia");
  });

  test("constructor() with base", () => {
    expect(new Router().base).toBe("/");
    expect(new Router("/foo").base).toBe("/foo");
  });

  test("clone()", () => {
    const ctx = new Router();
    ctx.routes = [noop, noop] as any[];
    expect(ctx).not.toBe(ctx.clone());
    expect(ctx.clone()).toBeInstanceOf(Router);
    expect(ctx.clone("/foo").base).toBe("/foo");

    const ctxRoutes = new Router("", [noop as any]);
    expect(ctxRoutes.clone().routes).not.toBe(ctxRoutes.routes);
    expect(ctxRoutes.clone().routes).toEqual(ctxRoutes.routes);
  });

  test("use() - mount router", () => {
    const subCtx = new Router();

    testRoute(new Router().use("/foo", subCtx, noop).routes[0], {
      keys: [],
      fns: [subCtx.clone("/foo"), noop],
      isMiddle: true,
      method: "",
    });

    // nested mount
    const subCtx2 = new Router().use("/bar", subCtx);
    testRoute(new Router().use("/foo", subCtx2, noop).routes[0], {
      keys: [],
      fns: [subCtx2.clone("/foo"), noop],
      isMiddle: true,
      method: "",
    });
    testRoute(subCtx2.routes[0], {
      keys: [],
      fns: [subCtx.clone("/bar")],
      isMiddle: true,
      method: "",
    });

    expect(() => new Router().use(new RegExp("/not/supported") as any, subCtx)).toThrow("Mounting a router to RegExp base is not supported");
  });

  test("exec() - execute handlers sequentially", async () => {
    const rreq = {};
    const rres = {};
    let idx = 0;
    const fns: Nextable<any>[] = [
      async (req, res, next) => {
        expect(idx++).toBe(0);
        expect(req).toBe(rreq);
        expect(res).toBe(rres);
        expect(typeof next).toBe("function");
        const val = await next();
        expect(val).toBe("bar");
        expect(idx++).toBe(4);
        return "final";
      },
      async (_req, _res, next) => {
        expect(idx++).toBe(1);
        await next();
        expect(idx++).toBe(3);
        return "bar";
      },
      async () => {
        expect(idx++).toBe(2);
        return "foo";
      },
    ];
    expect(await Router.exec(fns, rreq, rres)).toBe("final");
  });

  test("find() - returns middleOnly", () => {
    const ctx = new Router();
    const fn = () => undefined;
    ctx.add("", "/this/will/not/match", fn);
    ctx.add("POST", "/bar", fn);
    ctx.use("/", fn);
    ctx.use("/foo", fn);

    expect(ctx.find("GET", "/bar").middleOnly).toBe(true);
    expect(ctx.find("POST", "/bar").middleOnly).toBe(false);
  });
});

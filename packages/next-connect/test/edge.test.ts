import { describe, test, expect, vi } from "vitest";
import { createEdgeRouter, EdgeRouter } from "../src/edge.js";

const METHODS = ["GET", "HEAD", "PATCH", "DELETE", "POST", "PUT"];

describe("EdgeRouter", () => {
  test("internals", () => {
    const ctx = new EdgeRouter();
    expect(ctx).toBeInstanceOf(EdgeRouter);
    expect(typeof ctx.all).toBe("function");
    METHODS.forEach((str) => {
      expect(typeof ctx[str.toLowerCase() as keyof EdgeRouter]).toBe("function");
    });
  });

  test("createRouter() returns an instance", () => {
    expect(createEdgeRouter()).toBeInstanceOf(EdgeRouter);
  });

  test("handler() - handles incoming", async () => {
    let i = 0;
    const req = new Request("http://localhost/");
    const res = {};
    const router = createEdgeRouter<Request, any>()
      .use((req, res, next) => {
        expect(++i).toBe(1);
        return next();
      })
      .get(() => {
        expect(++i).toBe(2);
        return "ok";
      });
    
    expect(await router.handler()(req, res)).toBe("ok");
    expect(i).toBe(2);
  });

  test("handler() - handles errors", async () => {
    const error = new Error("💥");
    const req = new Request("http://localhost/");
    const router = createEdgeRouter<Request, any>()
      .get(() => {
        throw error;
      });
    
    const res = await router.handler()(req, {});
    expect(res).toBeInstanceOf(Response);
    expect((res as Response).status).toBe(500);
  });

  test("handler() - custom onError", async () => {
    const req = new Request("http://localhost/");
    const router = createEdgeRouter<Request, any>()
      .get(() => {
        throw new Error("💥");
      });
    
    const onError = vi.fn().mockReturnValue(new Response("custom error", { status: 501 }));
    const res = await router.handler({ onError })(req, {});
    expect(res).toBeInstanceOf(Response);
    expect((res as Response).status).toBe(501);
    expect(await (res as Response).text()).toBe("custom error");
  });

  test("handler() - onNoMatch", async () => {
    const req = new Request("http://localhost/not-found");
    const router = createEdgeRouter<Request, any>().get("/", () => "ok");
    
    const res = await router.handler()(req, {});
    expect(res).toBeInstanceOf(Response);
    expect((res as Response).status).toBe(404);
  });
});

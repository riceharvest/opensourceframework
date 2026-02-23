import { describe, test, expect, vi } from "vitest";
import { expressWrapper } from "../src/express.js";

describe("expressWrapper", () => {
  test("it wraps express-style handler", async () => {
    let i = 0;
    const req = {} as any;
    const res = {} as any;
    const next = vi.fn();
    
    const handler = expressWrapper((req, res, next) => {
      i++;
      next();
    });
    
    await handler(req, res, next);
    expect(i).toBe(1);
    expect(next).toHaveBeenCalled();
  });

  test("it propagates error from next(err)", async () => {
    const req = {} as any;
    const res = {} as any;
    const next = vi.fn();
    const error = new Error("💥");
    
    const handler = expressWrapper((req, res, next) => {
      next(error);
    });
    
    await expect(handler(req, res, next)).rejects.toThrow(error);
    expect(next).not.toHaveBeenCalled();
  });
});

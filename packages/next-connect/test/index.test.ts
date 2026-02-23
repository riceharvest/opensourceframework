import { test, expect } from "vitest";
import { createRouter, NodeRouter } from "../src/index.js";

test("exports createRouter", () => {
  expect(createRouter()).toBeInstanceOf(NodeRouter);
});

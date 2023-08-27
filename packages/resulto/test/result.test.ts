import { expect, it } from "vitest"

import { ok } from "../src/result"

it("works", async () => {
  const okResult = ok(4)

  const res = await okResult
    .asyncMap(async (value) => value * 2)
    .map((value) => value + 1)
    .map((value) => value + 1)
    .asyncMap(async (value) => value + 1)
    .asyncMap(async (value) => value + 1)
    .map((value) => value + 3)
    .asyncMap(async (value) => value + 1)

  expect(res.unwrap()).toBe(16)
})

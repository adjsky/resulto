import { expect, it } from "vitest"

import { ok } from "../src/result"

it("works", async () => {
  const okResult = ok(4)

  const res = await okResult
    .map((value) => value + 2)
    .asyncMap(async (value) => value * 2)
    .then((result) => result.map((value) => value + 1))

  expect(res.unwrap()).toBe(13)
})

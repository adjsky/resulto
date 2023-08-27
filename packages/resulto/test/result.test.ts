import { expect, it } from "vitest"

import { fromPromise, ok } from "../src/result"

it("works", async () => {
  const okResult = ok(4)

  const res1 = await okResult
    .asyncMap(async (value) => value * 2)
    .map((value) => value + 1)
    .map((value) => value + 1)
    .asyncMap(async (value) => value + 1)
    .asyncMap(async (value) => value + 1)
    .map((value) => value + 3)
    .asyncMap(async (value) => value + 1)

  expect(res1.unwrap()).toBe(16)

  const res2 = await fromPromise(Promise.resolve(5)).map((value) => value)

  expect(res2.unwrap()).toBe(5)

  function test() {
    return fromPromise(Promise.resolve(5))
  }

  expect(
    await test()
      .map((value) => value)
      .unwrap()
  ).toBe(5)
})

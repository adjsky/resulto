import { assertType, describe, test } from "vitest"

import { err, ok } from "../src"

describe(".value, .error", () => {
  const value = 4
  const okResult = ok(value)

  const error = "error"
  const errResult = err(error)

  test("okResult.value", () => {
    if (okResult.isOk()) {
      assertType(okResult.value)
    }

    if (okResult.isErr()) {
      return
    }

    assertType<number>(okResult.value)
  })

  test("errResult.error", () => {
    if (errResult.isErr()) {
      assertType(errResult.error)
    }

    if (errResult.isOk()) {
      return
    }

    assertType<string>(errResult.error)
  })
})

import { assertType, describe, test } from "vitest"

import { combine, err, ok } from "../src"
import { combineAsync } from "../src/result"

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

describe("combine/combineAsync", () => {
  test("infers Ok values", () => {
    {
      const res1 = ok([4])
      const res2 = ok("")

      assertType<[number[], string]>(combine([res1, res2]).unwrap())
      assertType<Promise<[number[], string]>>(
        combineAsync([res1, res2]).unwrap()
      )
    }

    assertType<[number, string]>(combine([ok(4), ok("")]).unwrap())
  })
})

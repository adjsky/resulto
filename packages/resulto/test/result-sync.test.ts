import { describe, expect, test, vi } from "vitest"

import { ResultError } from "../src"
import { err, fromThrowable, ok } from "../src"

describe("utils", () => {
  describe("ok", () => {
    test("isOk, isErr", () => {
      const res = ok(4)

      expect(res.isOk()).toBe(true)
      expect(res.isErr()).toBe(false)
    })

    test("predicates", () => {
      const res = ok(4)

      expect(res.isOkAnd((v) => v > 0)).toBe(true)
      expect(res.isErrAnd((v) => v > 0)).toBe(false)
    })
  })

  describe("err", () => {
    test("isOk, isErr", () => {
      const res = err(4)

      expect(res.isOk()).toBe(false)
      expect(res.isErr()).toBe(true)
    })

    test("predicates", () => {
      const res = err(4)

      expect(res.isOkAnd((v) => v > 0)).toBe(false)
      expect(res.isErrAnd((v) => v > 0)).toBe(true)
    })
  })

  describe("fromThrowable", () => {
    test("non-throwing fn", () => {
      expect(fromThrowable(() => 4).unwrap()).toBe(4)
    })

    test("throwing fn", () => {
      expect(
        fromThrowable(() => {
          throw "error"
        }).unwrapErr()
      ).toBe("error")
    })

    test("throwing fn with map fn", () => {
      expect(
        fromThrowable(
          () => {
            throw "some error"
          },
          () => "mapped error"
        ).unwrapErr()
      ).toBe("mapped error")
    })
  })
})

describe("Result.map", () => {
  test("Ok", () => {
    expect(
      ok(4)
        .map((v) => v + 1)
        .unwrap()
    ).toBe(5)
  })

  test("Err", () => {
    expect(
      err(4)
        .map((v) => v + 1)
        .unwrapErr()
    ).toBe(4)
  })
})

describe("Result.mapOr", () => {
  test("Ok", () => {
    expect(ok(4).mapOr(0, (v) => v + 1)).toBe(5)
  })

  test("Err", () => {
    expect(err(4).mapOr(0, (v) => v + 1)).toBe(0)
  })
})

describe("Result.mapOrElse", () => {
  test("Ok", () => {
    expect(
      ok(4).mapOrElse(
        () => 0,
        (v) => v + 1
      )
    ).toBe(5)
  })

  test("Err", () => {
    expect(
      err(4).mapOrElse(
        (errValue) => errValue - 1,
        (v) => v + 1
      )
    ).toBe(3)
  })
})

describe("Result.mapErr", () => {
  test("Ok", () => {
    expect(
      ok(4)
        .mapErr((v) => v + 1)
        .unwrap()
    ).toBe(4)
  })

  test("Err", () => {
    expect(
      err(4)
        .mapErr((v) => v + 1)
        .unwrapErr()
    ).toBe(5)
  })
})

describe("Result.inspect", () => {
  test("Ok", () => {
    const fn = vi.fn()

    ok(4).inspect(fn)

    expect(fn).toBeCalledWith(4)
  })

  test("Err", () => {
    const fn = vi.fn()

    err(4).inspect(fn)

    expect(fn).not.toBeCalled()
  })
})

describe("Result.inspectErr", () => {
  test("Ok", () => {
    const fn = vi.fn()

    ok(4).inspectErr(fn)

    expect(fn).not.toBeCalled()
  })

  test("Err", () => {
    const fn = vi.fn()

    err(4).inspectErr(fn)

    expect(fn).toBeCalledWith(4)
  })
})

describe("Result.expect", () => {
  test("Ok", () => {
    expect(ok(4).expect("error")).toBe(4)
  })

  test("Err", () => {
    expect(() => err(4).expect("error")).toThrow(new ResultError("error", 4))
  })
})

describe("Result.unwrap", () => {
  test("Ok", () => {
    expect(ok(4).unwrap()).toBe(4)
  })

  test("Err", () => {
    expect(() => err(4).unwrap()).toThrow(
      new ResultError("Called `unwrap` on `Err`", 4)
    )
  })
})

describe("Result.expectErr", () => {
  test("Ok", () => {
    expect(() => ok(4).expectErr("error")).toThrow(new ResultError("error", 4))
  })

  test("Err", () => {
    expect(err(4).expectErr("error")).toBe(4)
  })
})

describe("Result.unwrapErr", () => {
  test("Ok", () => {
    expect(() => ok(4).unwrapErr()).toThrow(
      new ResultError("Called `unwrapErr` on `Ok`", 4)
    )
  })

  test("Err", () => {
    expect(err(4).unwrapErr()).toBe(4)
  })
})

describe("Result.and", () => {
  test("Ok + Ok", () => {
    expect(ok(1).and(ok(2)).unwrap()).toEqual(2)
  })

  test("Ok + Err", () => {
    expect(ok<number, number>(1).and(err(2)).unwrapErr()).toEqual(2)
  })

  test("Err + ok", () => {
    expect(err(1).and(ok(2)).unwrapErr()).toEqual(1)
  })

  test("Err + Err", () => {
    expect(err(1).and(err(2)).unwrapErr()).toEqual(1)
  })
})

describe("Result.andThen", () => {
  describe("Ok", () => {
    test("Ok", () => {
      expect(
        ok(4)
          .andThen((v) => ok(v + 1))
          .unwrap()
      ).toBe(5)
    })

    test("Err", () => {
      expect(
        ok<number, number>(4)
          .andThen((v) => err(v - 1))
          .unwrapErr()
      ).toBe(3)
    })
  })

  test("Err", () => {
    expect(
      err(4)
        .andThen(() => ok(0))
        .unwrapErr()
    ).toBe(4)
  })
})

describe("Result.or", () => {
  test("Ok + Ok", () => {
    expect(ok(1).or(ok(2)).unwrap()).toEqual(1)
  })

  test("Ok + Err", () => {
    expect(ok(1).or(err(2)).unwrap()).toEqual(1)
  })

  test("Err + ok", () => {
    expect(err<number, number>(1).or(ok(2)).unwrap()).toEqual(2)
  })

  test("Err + Err", () => {
    expect(err(1).or(err(2)).unwrapErr()).toEqual(2)
  })
})

describe("Result.orElse", () => {
  test("Ok", () => {
    const fn = vi.fn()

    ok(4).orElse(fn)

    expect(fn).not.toBeCalled()
  })

  test("Err", () => {
    expect(
      err(4)
        .orElse((v) => err(v + 1))
        .unwrapErr()
    ).toBe(5)

    expect(
      err<number, number>(4)
        .orElse((v) => ok(v + 1))
        .unwrap()
    ).toBe(5)
  })

  test("Different `Result`", () => {
    ok("asdasd").orElse(() => err<number, "error">("error"))
  })
})

describe("Result.unwrapOr", () => {
  test("Ok", () => {
    expect(ok(4).unwrapOr(0)).toBe(4)
  })

  test("Err", () => {
    expect(err<number, number>(4).unwrapOr(0)).toBe(0)
  })

  test("Different type", () => {
    expect(ok<number, number>(4).unwrapOr("str")).toBe(4)
    expect(err<number, number>(4).unwrapOr("str")).toBe("str")
  })
})

describe("Result.unwrapOrElse", () => {
  test("Ok", () => {
    expect(ok(4).unwrapOrElse(() => 0)).toBe(4)
  })

  test("Err", () => {
    expect(err<number, number>(4).unwrapOrElse((v) => v - 1)).toBe(3)
  })
})

describe("Result.match", () => {
  test("Ok", () => {
    const okFn = vi.fn()
    const errFn = vi.fn()

    ok(4).match(okFn, errFn)

    expect(okFn).toBeCalledWith(4)
    expect(errFn).not.toBeCalled()
  })

  test("Err", () => {
    const okFn = vi.fn()
    const errFn = vi.fn()

    err(4).match(okFn, errFn)

    expect(okFn).not.toBeCalled()
    expect(errFn).toBeCalledWith(4)
  })
})

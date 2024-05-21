import { describe, expect, test, vi } from "vitest"

import {
  combineAsync,
  err,
  errAsync,
  fromPromise,
  fromSafePromise,
  ok,
  okAsync
} from "../src"

describe("utils", () => {
  test("okAsync", async () => {
    const res = await okAsync(4)

    expect(res.isOk()).toBe(true)
    expect(res.isErr()).toBe(false)
  })

  test("errAsync", async () => {
    const res = await errAsync(4)

    expect(res.isOk()).toBe(false)
    expect(res.isErr()).toBe(true)
  })

  describe("fromPromise", () => {
    test("non-rejecting fn", async () => {
      expect(await fromPromise(Promise.resolve(1)).unwrap()).toBe(1)
    })

    test("rejecting fn", async () => {
      expect(
        await fromPromise(Promise.reject("rejected error")).unwrapErr()
      ).toBe("rejected error")
    })

    test("rejecting fn with map fn", async () => {
      expect(
        await fromPromise(
          Promise.reject("rejected error"),
          () => "mapped error"
        ).unwrapErr()
      ).toBe("mapped error")
    })
  })

  describe("fromSafePromise", () => {
    test("non-rejecting fn", async () => {
      expect(await fromSafePromise(Promise.resolve(1)).unwrap()).toBe(1)
    })

    test("rejecting fn", async () => {
      await expect(
        fromSafePromise(Promise.reject("rejected error"))
      ).rejects.toThrow("rejected error")
    })
  })

  describe("combineAsync", () => {
    test("single `Ok`", async () => {
      expect(await combineAsync([ok(4)]).unwrap()).toEqual([4])
    })

    test("multiple `Ok`s", async () => {
      expect(await combineAsync([ok(4), okAsync("ook")]).unwrap()).toEqual([
        4,
        "ook"
      ])
    })

    test("single `Err`", async () => {
      expect(await combineAsync([err("err")]).unwrapErr()).toBe("err")
    })

    test("multiple `Err`s", async () => {
      expect(await combineAsync([err("1"), errAsync("2")]).unwrapErr()).toBe(
        "1"
      )
    })

    test("`Ok` + `Err`", async () => {
      expect(await combineAsync([okAsync(1), err(2)]).unwrapErr()).toBe(2)
    })
  })
})

describe("Result.asyncMap", () => {
  test("Ok", async () => {
    expect(
      await ok(2)
        .asyncMap(async (v) => v + 1)
        .unwrap()
    ).toBe(3)
  })

  test("Err", async () => {
    expect(
      await err(2)
        .asyncMap(async (v) => v + 1)
        .unwrapErr()
    ).toBe(2)
  })
})

describe("Result.asyncMapOr", () => {
  test("Ok", async () => {
    expect(await ok(2).asyncMapOr(0, async (v) => v + 1)).toBe(3)
  })

  test("Err", async () => {
    expect(await err(2).asyncMapOr(0, async (v) => v + 1)).toBe(0)
  })
})

describe("Result.asyncMapOrElse", () => {
  test("Ok", async () => {
    expect(
      await ok<number, number>(2).asyncMapOrElse(
        (err) => err - 1,
        async (v) => v + 1
      )
    ).toBe(3)
  })

  test("Err", async () => {
    expect(
      await err(2).asyncMapOrElse(
        (err) => err - 1,
        async (v) => v + 1
      )
    ).toBe(1)
  })
})

describe("Result.asyncMapErr", () => {
  test("Ok", async () => {
    expect(
      await ok(2)
        .asyncMapErr(async (v) => v + 1)
        .unwrap()
    ).toBe(2)
  })

  test("Err", async () => {
    expect(
      await err(2)
        .asyncMapErr(async (v) => v + 1)
        .unwrapErr()
    ).toBe(3)
  })
})

describe("Result.asyncAndThen", () => {
  describe("Ok", () => {
    test("Ok", async () => {
      expect(
        await ok(4)
          .asyncAndThen(async (v) => ok(v + 1))
          .unwrap()
      ).toBe(5)
    })

    test("Err", async () => {
      expect(
        await ok<number, number>(4)
          .asyncAndThen(async (v) => err(v - 1))
          .unwrapErr()
      ).toBe(3)
    })
  })

  test("Err", async () => {
    expect(
      await err(4)
        .asyncAndThen(async () => ok(0))
        .unwrapErr()
    ).toBe(4)
  })
})

describe("Result.asyncOrElse", () => {
  test("Ok", async () => {
    const fn = vi.fn()

    await ok(4).asyncOrElse(fn)

    expect(fn).not.toBeCalled()
  })

  test("Err", async () => {
    expect(
      await err(4)
        .asyncOrElse(async (v) => err(v + 1))
        .unwrapErr()
    ).toBe(5)

    expect(
      await err<number, number>(4)
        .asyncOrElse(async (v) => ok(v + 1))
        .unwrap()
    ).toBe(5)
  })
})

describe("Result.asyncUnwrapOrElse", () => {
  test("Ok", async () => {
    expect(await ok(4).asyncUnwrapOrElse(async () => 0)).toBe(4)
  })

  test("Err", async () => {
    expect(
      await err<number, number>(4).asyncUnwrapOrElse(async (v) => v - 1)
    ).toBe(3)
  })
})

describe("Result.asyncMatch", () => {
  test("Ok", async () => {
    const okFn = vi.fn()
    const errFn = vi.fn()

    await ok(4).asyncMatch(okFn, errFn)

    expect(okFn).toBeCalledWith(4)
    expect(errFn).not.toBeCalled()
  })

  test("Err", async () => {
    const okFn = vi.fn()
    const errFn = vi.fn()

    await err(4).match(okFn, errFn)

    expect(okFn).not.toBeCalled()
    expect(errFn).toBeCalledWith(4)
  })
})

test("chaining", async () => {
  expect(
    await okAsync(4)
      .asyncMap(async (v) => v + 1)
      .andThen((v) => ok(v + 1))
      .map((v) => v + 1)
      .unwrap()
  ).toBe(7)
})

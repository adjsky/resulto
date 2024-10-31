import { assert, assertEquals, assertRejects, assertThrows } from "@std/assert";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { assertType, type IsExact } from "@std/testing/types";
import {
  combine,
  combineAsync,
  err,
  errAsync,
  fromPromise,
  fromSafePromise,
  fromThrowable,
  ok,
  okAsync,
  ResultError,
} from "./result.ts";

Deno.test("ok", () => {
  const result = ok(4);
  assert(result.isOk());
  assert(!result.isErr());

  assertType<IsExact<typeof result.value, number>>(true);

  assert(result.isOkAnd((v) => v > 0));
});

Deno.test("err", () => {
  const result = err(4);
  assert(!result.isOk());
  assert(result.isErr());

  assertType<IsExact<typeof result.error, number>>(true);

  assert(result.isErrAnd((v) => v > 0));
});

Deno.test("fromThrowable", () => {
  assertEquals(fromThrowable(() => 4).unwrap(), 4);
  assertEquals(
    fromThrowable(() => {
      throw "error";
    }).unwrapErr(),
    "error",
  );
  assertEquals(
    fromThrowable(
      () => {
        throw "some error";
      },
      () => "mapped error",
    ).unwrapErr(),
    "mapped error",
  );
});

Deno.test("combine", () => {
  assertEquals(combine([ok(4)]).unwrap(), [4]);
  assertEquals(combine([ok(4), ok("ook")]).unwrap(), [4, "ook"]);
  assertEquals(combine([err("err")]).unwrapErr(), "err");
  assertEquals(combine([err("1"), err("2")]).unwrapErr(), "1");
  assertEquals(combine([ok(1), err(2)]).unwrapErr(), 2);

  {
    const v = combine([ok(4), ok("")]).unwrap();
    assertType<IsExact<typeof v, [number, string]>>(true);
  }

  {
    const v = combine([ok([4]), ok("")]).unwrap();
    assertType<IsExact<typeof v, [number[], string]>>(true);
  }
});

Deno.test("okAsync", async () => {
  const result = await okAsync(4);
  assert(result.isOk());
  assert(!result.isErr());
});

Deno.test("errAsync", async () => {
  const result = await errAsync(4);
  assert(!result.isOk());
  assert(result.isErr());
});

Deno.test("fromPromise", async () => {
  assertEquals(await fromPromise(Promise.resolve(1)).unwrap(), 1);

  assertEquals(
    await fromPromise(Promise.reject("rejected error")).unwrapErr(),
    "rejected error",
  );

  assertEquals(
    await fromPromise(
      Promise.reject("rejected error"),
      () => "mapped error",
    ).unwrapErr(),
    "mapped error",
  );
});

Deno.test("fromSafePromise", async () => {
  assertEquals(await fromSafePromise(Promise.resolve(1)).unwrap(), 1);

  await assertRejects(
    async () =>
      await fromSafePromise(Promise.reject(new Error("rejected error"))),
    Error,
    "rejected error",
  );
});

Deno.test("combineAsync", async () => {
  assertEquals(await combineAsync([ok(4)]).unwrap(), [4]);
  assertEquals(await combineAsync([ok(4), okAsync("ook")]).unwrap(), [
    4,
    "ook",
  ]);
  assertEquals(await combineAsync([err("err")]).unwrapErr(), "err");
  assertEquals(
    await combineAsync([err("1"), errAsync("2")]).unwrapErr(),
    "1",
  );
  assertEquals(await combineAsync([okAsync(1), err(2)]).unwrapErr(), 2);

  {
    const v = await combineAsync([ok([4]), ok("")]).unwrap();
    assertType<IsExact<typeof v, [number[], string]>>(true);
  }
});

Deno.test("Result.map", () => {
  assertEquals(
    ok(4)
      .map((v) => v + 1)
      .unwrap(),
    5,
  );
  assertEquals(
    err(4)
      .map((v) => v + 1)
      .unwrapErr(),
    4,
  );
});

Deno.test("Result.mapOr", () => {
  assertEquals(
    ok(4).mapOr(0, (v) => v + 1),
    5,
  );
  assertEquals(
    err(4).mapOr(0, (v) => v + 1),
    0,
  );
});

Deno.test("Result.mapOrElse", () => {
  assertEquals(
    ok(4).mapOrElse(
      () => 0,
      (v) => v + 1,
    ),
    5,
  );
  assertEquals(
    err(4).mapOrElse(
      (errValue) => errValue - 1,
      (v) => v + 1,
    ),
    3,
  );
});

Deno.test("Result.mapErr", () => {
  assertEquals(
    ok(4)
      .mapErr((v) => v + 1)
      .unwrap(),
    4,
  );
  assertEquals(
    err(4)
      .mapErr((v) => v + 1)
      .unwrapErr(),
    5,
  );
});

Deno.test("Result.inspect", () => {
  const fn = spy();

  ok(4).inspect(fn);
  assertSpyCalls(fn, 1);
  err(4).inspect(fn);
  assertSpyCalls(fn, 1);
});

Deno.test("Result.inspectErr", () => {
  const fn = spy();

  ok(4).inspectErr(fn);
  assertSpyCalls(fn, 0);
  err(4).inspectErr(fn);
  assertSpyCalls(fn, 1);
});

Deno.test("Result.tap", async () => {
  let modified = false;

  const fn = spy(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5));

    modified = true;
  });

  {
    const tapped = err("err").tap(fn);
    assertSpyCalls(fn, 0);
    assert(!modified);
    assertEquals(await tapped.unwrapErr(), "err");
  }

  {
    const tapped = await ok(4).tap(fn);

    assertSpyCall(fn, 0, { args: [4] });
    assert(modified);
    assertEquals(tapped.unwrap(), 4);
  }
});

Deno.test("Result.tapErr", async () => {
  let modified = false;

  const fn = spy(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5));

    modified = true;
  });

  {
    const tapped = ok(4).tapErr(fn);

    assertSpyCalls(fn, 0);
    assert(!modified);
    assertEquals(await tapped.unwrap(), 4);
  }

  {
    const tapped = await err("err").tapErr(fn);

    assertSpyCall(fn, 0, { args: ["err"] });
    assert(modified);
    assertEquals(tapped.unwrapErr(), "err");
  }
});

Deno.test("Result.expect", () => {
  assertEquals(ok(4).expect("error"), 4);
  assertThrows(() => err(4).expect("error"), ResultError, "error");
});

Deno.test("Result.unwrap", () => {
  assertEquals(ok(4).unwrap(), 4);
  assertThrows(
    () => err(4).unwrap(),
    ResultError,
    "Called `unwrap` on `Err`",
  );
});

Deno.test("Result.expectErr", () => {
  assertThrows(() => ok(4).expectErr("error"), ResultError, "error");
  assertEquals(err(4).expectErr("error"), 4);
});

Deno.test("Result.unwrapErr", () => {
  assertThrows(
    () => ok(4).unwrapErr(),
    ResultError,
    "Called `unwrapErr` on `Ok`",
  );
  assertEquals(err(4).unwrapErr(), 4);
});

Deno.test("Result.and", () => {
  assertEquals(ok(1).and(ok(2)).unwrap(), 2);
  assertEquals(ok<number, number>(1).and(err(2)).unwrapErr(), 2);
  assertEquals(err(1).and(ok(2)).unwrapErr(), 1);
  assertEquals(err(1).and(err(2)).unwrapErr(), 1);
});

Deno.test("Result.andThen", () => {
  assertEquals(
    ok(4)
      .andThen((v) => ok(v + 1))
      .unwrap(),
    5,
  );
  assertEquals(
    ok(4)
      .andThen((v) => err(v - 1))
      .unwrapErr(),
    3,
  );
  assertEquals(
    ok(4)
      .andThen(() => err("err"))
      .unwrapErr(),
    "err",
  );
  assertEquals(
    err(4)
      .andThen(() => ok(0))
      .unwrapErr(),
    4,
  );
  assertEquals(
    err(4)
      .andThen(() => err("qwe"))
      .unwrapErr(),
    4,
  );
});

Deno.test("Result.or", () => {
  assertEquals(ok(1).or(ok(2)).unwrap(), 1);
  assertEquals(ok(1).or(err(2)).unwrap(), 1);
  assertEquals(err<number, number>(1).or(ok(2)).unwrap(), 2);
  assertEquals(err(1).or(err(2)).unwrapErr(), 2);
});

Deno.test("Result.orElse", () => {
  const fn = spy((v: number) => ok(v / 2));

  ok(4).orElse(fn);

  assertSpyCalls(fn, 0);

  assertEquals(
    err(4)
      .orElse((v) => err(v + 1))
      .unwrapErr(),
    5,
  );
  assertEquals(
    err(4)
      .orElse((v) => ok(v + 1))
      .unwrap(),
    5,
  );
});

Deno.test("Result.unwrapOr", () => {
  assertEquals(ok(4).unwrapOr(0), 4);
  assertEquals(err(4).unwrapOr(0), 0);
  assertEquals(ok(4).unwrapOr("str"), 4);
  assertEquals(err(4).unwrapOr("str"), "str");
});

Deno.test("Result.unwrapOrElse", () => {
  assertEquals(
    ok(4).unwrapOrElse(() => 0),
    4,
  );
  assertEquals(
    err(4).unwrapOrElse((v) => v - 1),
    3,
  );
  assertEquals(
    ok(4).unwrapOrElse(() => "str"),
    4,
  );
  assertEquals(
    err(4).unwrapOrElse(() => "str"),
    "str",
  );
});

Deno.test("Result.match", () => {
  const okFn = spy();
  const errFn = spy();

  ok(4).match(okFn, errFn);

  assertSpyCall(okFn, 0, { args: [4] });
  assertSpyCalls(errFn, 0);

  err(4).match(okFn, errFn);

  assertSpyCalls(okFn, 1);
  assertSpyCall(errFn, 0, { args: [4] });
});

Deno.test("Result.asyncMap", async () => {
  assertEquals(
    await ok(2)
      .asyncMap((v) => Promise.resolve(v + 1))
      .unwrap(),
    3,
  );
  assertEquals(
    await err(2)
      .asyncMap((v) => Promise.resolve(v + 1))
      .unwrapErr(),
    2,
  );
});

Deno.test("Result.asyncMapOr", async () => {
  assertEquals(await ok(2).asyncMapOr(0, (v) => Promise.resolve(v + 1)), 3);
  assertEquals(await err(2).asyncMapOr(0, (v) => Promise.resolve(v + 1)), 0);
});

Deno.test("Result.asyncMapOrElse", async () => {
  assertEquals(
    await ok(2).asyncMapOrElse(
      (err) => err - 1,
      (v) => v + 1,
    ),
    3,
  );
  assertEquals(
    await err(2).asyncMapOrElse(
      (err) => err - 1,
      (v) => v + 1,
    ),
    1,
  );
});

Deno.test("Result.asyncMapErr", async () => {
  assertEquals(
    await ok(2)
      .asyncMapErr((v) => Promise.resolve(v + 1))
      .unwrap(),
    2,
  );
  assertEquals(
    await err(2)
      .asyncMapErr((v) => Promise.resolve(v + 1))
      .unwrapErr(),
    3,
  );
});

Deno.test("Result.asyncAndThen", async () => {
  assertEquals(
    await ok(4)
      .asyncAndThen((v) => Promise.resolve(ok(v + 1)))
      .unwrap(),
    5,
  );
  assertEquals(
    await ok(4)
      .asyncAndThen((v) => Promise.resolve(err(v - 1)))
      .unwrapErr(),
    3,
  );
  assertEquals(
    await err(4)
      .asyncAndThen(() => Promise.resolve(ok(0)))
      .unwrapErr(),
    4,
  );
});

Deno.test("Result.asyncOrElse", async () => {
  const f = spy(() => Promise.resolve(ok(5)));

  await ok(4).asyncOrElse(f);
  assertSpyCalls(f, 0);

  assertEquals(
    await err(4)
      .asyncOrElse((v) => Promise.resolve(err(v + 1)))
      .unwrapErr(),
    5,
  );

  assertEquals(
    await err(4)
      .asyncOrElse((v) => Promise.resolve(ok(v - 1)))
      .unwrap(),
    3,
  );
});

Deno.test("Result.asyncUnwrapOrElse", async () => {
  assertEquals(await ok(4).asyncUnwrapOrElse(() => Promise.resolve(0)), 4);
  assertEquals(
    await err(4).asyncUnwrapOrElse((v) => Promise.resolve(v - 1)),
    3,
  );
});

Deno.test("Result.asyncMatch", async () => {
  const okFn = spy();
  const errFn = spy();

  await ok(4).asyncMatch(okFn, errFn);

  assertSpyCall(okFn, 0, { args: [4] });
  assertSpyCalls(errFn, 0);

  await err(-1).asyncMatch(okFn, errFn);

  assertSpyCalls(okFn, 1);
  assertSpyCall(errFn, 0, { args: [-1] });
});

Deno.test("chaining", async () => {
  assertEquals(
    await okAsync(4)
      .asyncMap((v) => Promise.resolve(v + 1))
      .andThen((v) => ok(v + 1))
      .map((v) => v + 1)
      .unwrap(),
    7,
  );
});

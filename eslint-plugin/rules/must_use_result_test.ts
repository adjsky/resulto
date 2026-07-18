import rule from "../rules/must_use_result.ts";
import { withPreamble } from "../test/preamble.ts";
import { tester } from "../test/tester.ts";

tester.run(
  "must-use-result",
  rule,
  {
    valid: withPreamble([
      {
        name: "assign a sync result and match it",
        code: `
          const okResult = ok(5);
          const errResult = err(5);

          ok(5).match(noop, noop);
          ok(5).asyncMatch(noop, noop);

          err(5).match(noop, noop);
          err(5).asyncMatch(noop, noop);
        `,
      },
      {
        name: "create a sync result using class constructor and assign it",
        code: `
          const okResult = new Ok(5);
          const errResult = new Err(5);
        `,
      },

      {
        name: "assign an async result and match it",
        code: `
          const okAsyncResult = okAsync(5);
          const errAsyncResult = errAsync(5);

          okAsync(5).match(noop, noop);
          okAsync(5).asyncMatch(noop, noop);

          errAsync(5).match(noop, noop);
          errAsync(5).asyncMatch(noop, noop);
        `,
      },

      {
        name: "assign an async result and match it, using await",
        code: `
          const okAsyncResult = await okAsync(5);
          const errAsyncResult = await errAsync(5);

          (await okAsync(5)).match(noop, noop);
          (await okAsync(5)).asyncMatch(noop, noop);

          (await errAsync(5)).match(noop, noop);
          (await errAsync(5)).asyncMatch(noop, noop);
        `,
      },

      {
        name: "return a sync result in a sync function and assign it",
        code: `
          const okResult = getOk();
          const errResult = getErr();
        `,
      },

      {
        name: "return an async result in a sync function and assign it",
        code: `
          const okAsyncResult = getOkAsync();
          const errAsyncResult = getErrAsync();
        `,
      },

      {
        name: "return a sync result in an async function and assign it",
        code: `
          const okResultPromise = asyncGetOk();
          const errResultPromise = asyncGetErr();
        `,
      },

      {
        name: "return an async result in an async function and assign it",
        code: `
          const okAsyncResultPromise = asyncGetAsyncOk();
          const errAsyncResultPromise = asyncGetAsyncOk();
        `,
      },

      {
        name: "return a sync result in an async function, await and assign it",
        code: `
          const okResult = await asyncGetOk();
          const errResult = await asyncGetErr();
        `,
      },

      {
        name:
          "return an async result in an async function, await and assign it",
        code: `
          const okAsyncResult = await asyncGetAsyncOk();
          const errAsyncResult = await asyncGetAsyncErr();
        `,
      },

      {
        name: "create a sync result and immediately pass it as an argument",
        code: `
          function doSomething(res: Result<unknown, unknown>) {
            //
          }

          doSomething(ok(4));
          doSomething(err(5));
        `,
      },

      {
        name: "create results in an array expression, assigned to a variable",
        code: `
          const _ = [ok(1), err(2), okAsync(3), errAsync(4)];
        `,
      },
      {
        name: "create results in an array expression",
        code: `
          [ok(3), err(5), okAsync(2), errAsync(0)];
        `,
      },

      {
        name:
          "create a sync result in an object expression, assigned to a variable",
        code: `
          const _ = {
            res: ok(2)
          };
        `,
      },

      {
        name: "create a sync result and return it from an arrow function",
        code: `
          () => ok(1);
        `,
      },

      {
        name: "create a sync result and return it from a regular function",
        code: `
          function fn() {
            return ok(1);
          }
        `,
      },

      {
        name: "create a sync result and assign it to a declared variable",
        code: `
          let res;
          res = ok(1);
        `,
      },

      {
        name: "do stuff with results in logical expressions and assign them",
        code: `
          let someBool = false;
          const _ = someBool ? ok(4) : err(2);
          const _ = someBool && ok(4);
          const _ = someBool || err(4);
          const _ = someBool ?? ok(2);
        `,
      },
      {
        name:
          "do stuff with results in logical expressions and assign them to a declared variable",
        code: `
          let res;
          res = false ? ok(4) : err(2);
          res = true && ok(4);
          res = false || err(4);
          res = true ?? ok(2);
        `,
      },

      {
        name: "pass results as arguments using logical expressions",
        code: `
          function fn(res: Result<unknown, unknown>) {
            //
          }

          fn(false && ok(4));
          fn(false ? ok(4) : err(5));
        `,
      },

      {
        name:
          "return a result from a sync function after calling some method on it returning another result",
        code: `
          function test() {
            return ok(4).chain();
          }
        `,
      },
      {
        name:
          "return a result from an async function after calling some method on it returning another result",
        code: `
          async function test() {
            return await okAsync(4).chain();
          }
        `,
      },
    ]),
    invalid: withPreamble([
      {
        name: "create a sync result but don't assign it",
        code: `
          ok(5);
          err(5);
        `,
        errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }],
      },

      {
        name:
          "create a sync result using class constructor but don't assign it",
        code: `
          new Ok(5);
          new Err(5);
        `,
        errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }],
      },

      {
        name: "create an async result but don't assign it",
        code: `
          okAsync(5);
          errAsync(5);
        `,
        errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }],
      },

      {
        name: "create an async result, await it, but don't assign it",
        code: `
          await okAsync(5);
          await errAsync(5);
        `,
        errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }],
      },

      {
        name:
          "call a sync function, returning a sync result, but don't assign it",
        code: `
          declare function getOk(): Result<unknown, never>;
          declare function getErr(): Result<never, unknown>;

          getOk();
          getErr();
        `,
        errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }],
      },

      {
        name:
          "call a sync function, returning an async result, but don't assign it",
        code: `
          declare function getAsyncOk(): AsyncResult<unknown, never>;
          declare function getAsyncErr(): AsyncResult<never, unknown>;

          getAsyncOk();
          getAsyncErr();
        `,
        errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }],
      },

      {
        name:
          "call an async function, returning a sync result, but don't assign it",
        code: `
          declare function asyncGetOk(): Promise<Result<unknown, never>>;
          declare function asyncGetErr(): Promise<Result<never, unknown>>;

          asyncGetOk();
          asyncGetErr();
        `,
        errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }],
      },

      {
        name:
          "call an async function, returning an async result, but don't assign it",
        code: `
          declare function asyncGetAsyncOk(): Promise<AsyncResult<unknown, never>>
          declare function asyncGetAsyncErr(): Promise<AsyncResult<never, unknown>>

          asyncGetAsyncOk();
          asyncGetAsyncOk();
        `,
        errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }],
      },

      {
        name:
          "call an async function, returning a sync result, await it, but don't assign it",
        code: `
          declare function asyncGetOk(): Promise<Result<unknown, never>>
          declare function asyncGetErr(): Promise<Result<never, unknown>>
          await asyncGetOk();
          await asyncGetErr();
        `,
        errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }],
      },

      {
        name:
          "call an async function, returning an async result, await it, but don't assign it",
        code: `
          declare function asyncGetAsyncOk(): Promise<AsyncResult<unknown, never>>
          declare function asyncGetAsyncErr(): Promise<AsyncResult<never, unknown>>
          
          await asyncGetAsyncOk();
          await asyncGetAsyncErr();
        `,
        errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }],
      },
    ]),
  },
);

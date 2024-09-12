import { RuleTester } from "@typescript-eslint/rule-tester"

import rule from "../src/rules/must-use-result"
import { injectCode } from "./inject-code"

const tester = new RuleTester({
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: `${__dirname}/fixture`,
      project: "./tsconfig.json"
    }
  }
})

tester.run("must-use-result", rule, {
  valid: [
    {
      code: injectCode(`
        const okResult = ok(5)
        const errResult = err(5)

        ok(5).match(noop, noop)
        ok(5).asyncMatch(noop, noop)

        err(5).match(noop, noop)
        err(5).asyncMatch(noop, noop)
      `)
    },
    {
      code: injectCode(`
        const okResult = new Ok(5)
        const errResult = new Err(5)
      `)
    },

    {
      code: injectCode(`
        const okAsyncResult = okAsync(5)
        const errAsyncResult = errAsync(5)

        okAsync(5).match(noop, noop)
        okAsync(5).asyncMatch(noop, noop)

        errAsync(5).match(noop, noop)
        errAsync(5).asyncMatch(noop, noop)
      `)
    },

    {
      code: injectCode(`
        const okAsyncResult = await okAsync(5)
        const errAsyncResult = await errAsync(5)

        (await okAsync(5)).match(noop, noop)
        (await okAsync(5)).asyncMatch(noop, noop)

        (await errAsync(5)).match(noop, noop)
        (await errAsync(5)).asyncMatch(noop, noop)
      `)
    },

    {
      code: injectCode(`
        const okResult = getOk()
        const errResult = getErr()
      `)
    },

    {
      code: injectCode(`
        const okAsyncResult = getOkAsync()
        const errAsyncResult = getErrAsync()
      `)
    },

    {
      code: injectCode(`
        const okResultPromise = asyncGetOk()
        const errResultPromise = asyncGetErr()
      `)
    },

    {
      code: injectCode(`
        const okAsyncResultPromise = asyncGetOkAsync()
        const errAsyncResultPromise = asyncGetOkAsync()
      `)
    },

    {
      code: injectCode(`
        const okResult = await asyncGetOk()
        const errResult = await asyncGetErr()
      `)
    },

    {
      code: injectCode(`
        const okAsyncResult = await asyncGetOkAsync()
        const errAsyncResult = await asyncGetErrAsync()
      `)
    },

    {
      code: injectCode(`
        const okResult = await asyncGetAwaitedOk()
        const errResult = await asyncGetAwaitedOk()
      `)
    },

    {
      code: injectCode(`
        const okAsyncResult = await asyncGetAwaitedOkAsync()
        const errAsyncResult = await asyncGetAwaitedOkAsync()
      `)
    },

    {
      code: injectCode(`
        function doSomething(res: Result<unknown, unknown>) {
          //
        }
        doSomething(ok(4))
        doSomething(err(5))
      `)
    },

    {
      code: injectCode(`
        const _ = [ok(1), err(2), okAsync(3), errAsync(4)]
      `)
    },
    {
      code: injectCode(`
        [ok(3), err(5), okAsync(2), errAsync(0)]
      `)
    },

    {
      code: injectCode(`
        const _ = {
          res: ok(2)
        }
      `)
    },

    {
      code: injectCode(`
        () => ok(1)
      `)
    },

    {
      code: injectCode(`
        function fn() {
          return ok(1)
        }
      `)
    },

    {
      code: injectCode(`
        let res
        res = ok(1)
      `)
    },

    {
      code: injectCode(`
        let someBool = false
        const _ = someBool ? ok(4) : err(2)
        const _ = someBool && ok(4)
        const _ = someBool || err(4)
        const _ = someBool ?? ok(2)
      `)
    },
    {
      code: injectCode(`
        let res
        res = false ? ok(4) : err(2)
        res = true && ok(4)
        res = false || err(4)
        res = true ?? ok(2)
      `)
    },

    {
      code: injectCode(`
        function fn(res: Result<unknown, unknown>) {
          //
        }

        fn(false && ok(4))
        fn(false ? ok(4) : err(5))
      `)
    },

    {
      code: injectCode(`
        function test() {
          return ok(4).chain()
        }
      `)
    },
    {
      code: injectCode(`
        async function test() {
          return await okAsync(4).chain()
        }
      `)
    }
  ],
  invalid: [
    {
      code: injectCode(`
        ok(5)
        err(5)
      `),
      errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }]
    },

    {
      code: injectCode(`
        new Ok(5)
        new Err(5)
      `),
      errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }]
    },

    {
      code: injectCode(`
        okAsync(5)
        errAsync(5)
      `),
      errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }]
    },

    {
      code: injectCode(`
        await okAsync(5)
        await errAsync(5)
      `),
      errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }]
    },

    {
      code: injectCode(`
        getOk()
        getErr()
      `),
      errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }]
    },

    {
      code: injectCode(`
        getAsyncOk()
        getAsyncErr()
      `),
      errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }]
    },

    {
      code: injectCode(`
        asyncGetOk()
        asyncGetErr()
      `),
      errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }]
    },

    {
      code: injectCode(`
        asyncGetAsyncOk()
        asyncGetAsyncOk()
      `),
      errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }]
    },

    {
      code: injectCode(`
        await asyncGetOk()
        await asyncGetErr()
      `),
      errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }]
    },

    {
      code: injectCode(`
        await asyncGetAsyncOk()
        await asyncGetAsyncErr()
      `),
      errors: [{ messageId: "mustUse" }, { messageId: "mustUse" }]
    }
  ]
})

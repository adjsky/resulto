import { RuleTester } from "@typescript-eslint/rule-tester"

import rule from "../src/rules/must-use-result"
import { injectCode } from "./inject-code"

const tester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: `${__dirname}/fixture`,
    project: "./tsconfig.json"
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

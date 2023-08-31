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
    // constructors
    { code: injectCode("const okResult = ok(5)") },
    { code: injectCode("const errResult = err(5)") },

    // async constructors
    { code: injectCode("const okAsyncResult = okAsync(5)") },
    { code: injectCode("const errAsyncResult = errAsync(5)") },
    // async constructors with await
    { code: injectCode("const okAsyncResult = await okAsync(5)") },
    { code: injectCode("const errAsyncResult = await errAsync(5)") },

    // function with constructor + call
    {
      code: injectCode(`
        function get() {
          return ok()
        }
    
        const res = get()
      `)
    },
    {
      code: injectCode(`
        function get() {
          return err()
        }
    
        const res = get()
      `)
    },

    // function with async constructor + call
    {
      code: injectCode(`
        function get() {
          return okAsync()
        }
    
        const res = get()
      `)
    },
    {
      code: injectCode(`
        function get() {
          return errAsync()
        }
    
        const res = get()
      `)
    },

    // async function with constructor + call
    {
      code: injectCode(`
        async function get() {
          return ok()
        }
    
        const res = get()
      `)
    },
    {
      code: injectCode(`
        async function get() {
          return err()
        }
    
        const res = get()
      `)
    },

    // async function with async constructor + call
    {
      code: injectCode(`
        async function get() {
          return okAsync()
        }
    
        const res = get()
      `)
    },
    {
      code: injectCode(`
        async function get() {
          return errAsync()
        }
    
        const res = get()
      `)
    },

    // async function with constructor + await call
    {
      code: injectCode(`
        async function get() {
          return ok()
        }
    
        const res = await get()
      `)
    },
    {
      code: injectCode(`
        async function get() {
          return err()
        }
    
        const res = await get()
      `)
    },

    // async function with async constructor + await call
    {
      code: injectCode(`
        async function get() {
          return okAsync()
        }
    
        const res = await get()
      `)
    },
    {
      code: injectCode(`
        async function get() {
          return errAsync()
        }
    
        const res = await get()
      `)
    },

    // async function with awaited constructor + await call
    {
      code: injectCode(`
        async function get() {
          return await ok()
        }
    
        const res = await get()
      `)
    },
    {
      code: injectCode(`
        async function get() {
          return await err()
        }
    
        const res = await get()
      `)
    },

    // async function with awaited async constructor + await call
    {
      code: injectCode(`
        async function get() {
          return await okAsync()
        }
    
        const res = await get()
      `)
    },
    {
      code: injectCode(`
        async function get() {
          return await errAsync()
        }
    
        const res = await get()
      `)
    }
  ],
  invalid: [
    // constructors
    { code: injectCode("ok(5)"), errors: [{ messageId: "mustUse" }] },
    { code: injectCode("err(5)"), errors: [{ messageId: "mustUse" }] },

    // async constructors
    {
      code: injectCode("okAsync(5)"),
      errors: [{ messageId: "mustUse" }]
    },
    {
      code: injectCode("errAsync(5)"),
      errors: [{ messageId: "mustUse" }]
    },

    // async constructors with await
    {
      code: injectCode("await okAsync(5)"),
      errors: [{ messageId: "mustUse" }]
    },
    {
      code: injectCode("await errAsync(5)"),
      errors: [{ messageId: "mustUse" }]
    },

    // function with constructor + call
    {
      code: injectCode(`
        function get() {
          return ok()
        }
    
        get()
      `),
      errors: [{ messageId: "mustUse" }]
    },
    {
      code: injectCode(`
        function get() {
          return err()
        }
    
        get()
      `),
      errors: [{ messageId: "mustUse" }]
    },

    // function with async constructor + call
    {
      code: injectCode(`
        function get() {
          return okAsync()
        }
    
        get()
      `),
      errors: [{ messageId: "mustUse" }]
    },
    {
      code: injectCode(`
        function get() {
          return errAsync()
        }
    
        get()
      `),
      errors: [{ messageId: "mustUse" }]
    },

    // async function with constructor + call
    {
      code: injectCode(`
        async function get() {
          return ok()
        }
    
        get()
      `),
      errors: [{ messageId: "mustUse" }]
    },
    {
      code: injectCode(`
        async function get() {
          return err()
        }
    
        get()
      `),
      errors: [{ messageId: "mustUse" }]
    },

    // async function with async constructor + call
    {
      code: injectCode(`
        async function get() {
          return okAsync()
        }
    
        get()
      `),
      errors: [{ messageId: "mustUse" }]
    },
    {
      code: injectCode(`
        async function get() {
          return errAsync()
        }
    
        get()
      `),
      errors: [{ messageId: "mustUse" }]
    },

    // async function with constructor + await call
    {
      code: injectCode(`
        async function get() {
          return ok()
        }
    
        await get()
      `),
      errors: [{ messageId: "mustUse" }]
    },
    {
      code: injectCode(`
        async function get() {
          return err()
        }
    
        await get()
      `),
      errors: [{ messageId: "mustUse" }]
    },

    // async function with async constructor + await call
    {
      code: injectCode(`
        async function get() {
          return okAsync()
        }
    
        await get()
      `),
      errors: [{ messageId: "mustUse" }]
    },
    {
      code: injectCode(`
        async function get() {
          return errAsync()
        }
    
        await get()
      `),
      errors: [{ messageId: "mustUse" }]
    },

    // async function with awaited constructor + await call
    {
      code: injectCode(`
        async function get() {
          return await ok()
        }
    
        await get()
      `),
      errors: [{ messageId: "mustUse" }]
    },
    {
      code: injectCode(`
        async function get() {
          return await err()
        }
    
        await get()
      `),
      errors: [{ messageId: "mustUse" }]
    },

    // async function with awaited async constructor + await call
    {
      code: injectCode(`
        async function get() {
          return await okAsync()
        }
    
        await get()
      `),
      errors: [{ messageId: "mustUse" }]
    },
    {
      code: injectCode(`
        async function get() {
          return await errAsync()
        }
    
        await get()
      `),
      errors: [{ messageId: "mustUse" }]
    }
  ]
})

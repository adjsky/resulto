# `resulto`

A Rust-inspired `Result` and `Option` library for writing more correct
TypeScript, with an ESLint plugin that helps catch ignored results.

Both types have first-class async support. Use `AsyncResult` and `AsyncOption`
to chain operations without awaiting every step, and methods such as `asyncMap`,
`asyncAndThen`, and `asyncMatch` for asynchronous callbacks.

> Also check out
> [eslint-plugin-resulto](https://github.com/adjsky/resulto/tree/master/eslint-plugin).
> It warns when a `Result` is ignored, helping you handle errors consistently.

## Installation

```bash
npm install resulto
```

With Deno:

```bash
deno add jsr:@resulto/core
```

## API documentation

https://jsr.io/@resulto/core/doc

## Why?

Exceptions are awkward to work with in JavaScript. Any function can throw, its
signature does not tell you which errors to expect, and the language cannot
require callers to catch them. It is therefore easy to forget an error path
until it fails at runtime. Representing errors as `Result` values makes failure
part of the type and, together with the ESLint plugin, requires callers to use
the result. `Option` does the same for values that may be absent. This makes
both cases part of normal, explicit control flow.

There are several `Result` implementations for TypeScript, but I couldn't find a
full-fledged library that combined the three things I wanted:

- **A familiar, complete API.** Resulto closely mirrors Rust's `Result` and
  `Option` APIs, bringing their well-established patterns to TypeScript instead
  of offering only a small set of helpers.
- **Async support throughout.** Real applications perform network requests,
  database queries, and other asynchronous work. `AsyncResult` and `AsyncOption`
  let you compose those operations without repeatedly unwrapping values or
  breaking a chain with intermediate `await` expressions.
- **Enforcement at development time.** Returning a `Result` only helps when the
  caller uses it. The ESLint plugin warns about ignored synchronous and
  asynchronous results, catching mistakes before they become lost errors.

This library brings these pieces together so explicit error handling remains
practical across an entire TypeScript codebase, not just in isolated functions.

## License

[MIT](https://github.com/adjsky/resulto/blob/master/LICENSE)

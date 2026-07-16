# `resulto`

[![Build Size](https://img.shields.io/bundlephobia/minzip/resulto?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/package/resulto)
[![Version](https://img.shields.io/npm/v/resulto?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/resulto)
[![Maintained](https://img.shields.io/maintenance/yes/2024?style=flat&colorA=000000&colorB=000000)](https://github.com/adjsky/resulto/commits/master)
[![Issues](https://img.shields.io/github/issues/adjsky/resulto?style=flat&colorA=000000&colorB=000000)](https://github.com/adjsky/resulto/issues)

A Rust-inspired `Result` and `Option` library for writing more correct
TypeScript, with an ESLint plugin that helps catch ignored results.

Both types have first-class async support. Use `AsyncResult` and `AsyncOption`
to chain operations without awaiting every step, and methods such as `asyncMap`,
`asyncAndThen`, and `asyncMatch` for asynchronous callbacks.

## Installation

```bash
npm install resulto
```

With Deno:

```bash
deno add jsr:@resulto/core
```

## API documentation

- [Result](https://jsr.io/@resulto/core/doc/~/Result)
- [AsyncResult](https://jsr.io/@resulto/core/doc/~/AsyncResult)
- [Option](https://jsr.io/@resulto/core/doc/~/Option)
- [AsyncOption](https://jsr.io/@resulto/core/doc/~/AsyncOption)
- [ok](https://jsr.io/@resulto/core/doc/~/ok) /
  [okAsync](https://jsr.io/@resulto/core/doc/~/okAsync)
- [err](https://jsr.io/@resulto/core/doc/~/err) /
  [errAsync](https://jsr.io/@resulto/core/doc/~/errAsync)
- [some](https://jsr.io/@resulto/core/doc/~/some) /
  [someAsync](https://jsr.io/@resulto/core/doc/~/someAsync)
- [none](https://jsr.io/@resulto/core/doc/~/none) /
  [noneAsync](https://jsr.io/@resulto/core/doc/~/noneAsync)
- [fromPromise](https://jsr.io/@resulto/core/doc/~/fromPromise)
- [fromSafePromise](https://jsr.io/@resulto/core/doc/~/fromSafePromise)
- [fromThrowable](https://jsr.io/@resulto/core/doc/~/fromThrowable)
- [combine](https://jsr.io/@resulto/core/doc/~/combine) /
  [combineAsync](https://jsr.io/@resulto/core/doc/~/combineAsync)

> 👉 Also check out [repository root](https://github.com/adjsky/resulto#readme)
> for more info.

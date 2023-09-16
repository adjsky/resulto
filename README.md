# `resulto`

TypeScript implementation of the `Result` type from `Rust` with a full-fledged
interface to work with async primitives.

> Also check out
> [eslint-plugin-resulto](https://github.com/adjsky/resulto/tree/master/packages/eslint-plugin-resulto).
> This ESLint plugin ensures that your Results are used to prevent leaving
> Err variants unhandled.

## Installation

```bash
npm install resulto
```

## API documentation

https://adjsky.github.io/resulto/

## History

Exceptions are dangerous. Most of the time you do not know some function you
use could throw, you forget to wrap this function in a `try/catch` block and
deploy your broken application to production.

Exceptions are ugly. Wraping each function call that may throw in a `try/catch`
block for regular control flow lead to convoluted and smelly code.

There are many packages that implement `Result`, but there is no package that
implements a full-fledged interface to work with async primitives and an
`ESLint` package to make sure `Results` are handled.

That is why I made this repository: to make my life and the lives of other
developers easier.

## License

[MIT](https://github.com/adjsky/resulto/blob/master/LICENSE)

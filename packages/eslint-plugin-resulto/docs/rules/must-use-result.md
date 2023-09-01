# Result must be used to make sure errors are handled (`resulto/must-use-result`)

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

## Rule details

This rule forbids ignoring `Results`. You must handle `Result` either by assigning it to a variable or by calling `match` on a `Result`.

In fact this rule copies behavior of the [`#[must_use]`](https://doc.rust-lang.org/reference/attributes/diagnostics.html#the-must_use-attribute) attribute from `Rust`.

## Options

```js
...
"resulto/must-use-result": [<enabled>]
...
```

## Implementation

- [Rule source](https://github.com/adjsky/resulto/blob/master/packages/eslint-plugin-resulto/src/rules/must-use-result.ts)
- [Tests source](https://github.com/adjsky/resulto/blob/master/packages/eslint-plugin-resulto/test/must-use.test.ts)

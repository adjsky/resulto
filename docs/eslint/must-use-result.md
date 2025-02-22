# Result must be used to make sure errors are handled (`resulto/must-use-result`)

## Rule details

This rule forbids ignoring `Results`. You must handle `Result` either by
assigning it to a variable or by calling `match` on a `Result`.

In fact this rule copies behavior of the
[`#[must_use]`](https://doc.rust-lang.org/reference/attributes/diagnostics.html#the-must_use-attribute)
attribute from `Rust`.

## Options

```js
...
"resulto/must-use-result": [<enabled>]
...
```

## Implementation

- [Rule source](https://github.com/adjsky/resulto/blob/master/eslint-plugin/rules/must_use_result.ts)
- [Tests source](https://github.com/adjsky/resulto/blob/master/eslint-plugin/rules/must_use_result_test.ts)

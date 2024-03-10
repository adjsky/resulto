# `eslint-plugin-resulto`

[![Build Size](https://img.shields.io/bundlephobia/minzip/eslint-plugin-resulto?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/package/eslint-plugin-resulto)
[![Version](https://img.shields.io/npm/v/eslint-plugin-resulto?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/eslint-plugin-resulto)
[![Maintained](https://img.shields.io/maintenance/yes/2024?style=flat&colorA=000000&colorB=000000)](https://github.com/adjsky/resulto/commits/master)
[![Issues](https://img.shields.io/github/issues/adjsky/resulto?style=flat&colorA=000000&colorB=000000)](https://github.com/adjsky/resulto/issues)

## Installation

```bash
npm install --save-dev eslint typescript @typescript-eslint/parser eslint-plugin-resulto @typescript-eslint/eslint-plugin
```

## Configuration

1. Create/modify your `tsconfig.json`.

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

2. Create/modify your `ESLint` configuration file, i.e. `.eslintrc.json`.

```json
{
  "root": true,
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": ["@typescript-eslint", "resulto"],
  "rules": {
    "resulto/must-use-result": "error"
  }
}
```

> See [typescript-eslint docs](https://typescript-eslint.io/getting-started/)
> for more info.

### Hint

In Rust it is idiomatic to assign a must-used value to a variable named `_` when
you want to purposely discard this value.

To make this work in TypeScript without making ESLint or tsc angry you need to:

1. Add this rule to your `ESLint` configuration file, i.e. `.eslintrc.json`

```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "varsIgnorePattern": "^_"
      }
    ]
  }
}
```

2. Make sure you do not have `noUnusedLocals` set to `true` in `tsconfig.json`

## Available configs

- `resulto/recommended` - recommended rules.

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.

| Name                                             | Description                                          | 💼  |
| :----------------------------------------------- | :--------------------------------------------------- | :-- |
| [must-use-result](docs/rules/must-use-result.md) | Result must be used to make sure errors are handled. | ✅  |

<!-- end auto-generated rules list -->

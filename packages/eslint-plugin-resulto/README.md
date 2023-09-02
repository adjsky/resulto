# `eslint-plugin-resulto`

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

> See [typescript-eslint docs](https://typescript-eslint.io/getting-started/) for more info.

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

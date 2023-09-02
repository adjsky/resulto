[resulto](../README.md) / [Exports](../modules.md) / ResultError

# Class: ResultError

## Hierarchy

- `Error`

  ↳ **`ResultError`**

## Table of contents

### Constructors

- [constructor](ResultError.md#constructor)

### Properties

- [data](ResultError.md#data)
- [message](ResultError.md#message)
- [name](ResultError.md#name)
- [stack](ResultError.md#stack)
- [prepareStackTrace](ResultError.md#preparestacktrace)
- [stackTraceLimit](ResultError.md#stacktracelimit)

### Methods

- [captureStackTrace](ResultError.md#capturestacktrace)

## Constructors

### constructor

• **new ResultError**(`message`, `data`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `data` | `unknown` |

#### Overrides

Error.constructor

#### Defined in

packages/resulto/src/utility.ts:12

## Properties

### data

• **data**: `unknown`

#### Defined in

packages/resulto/src/utility.ts:10

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es5.d.ts:1069

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/.pnpm/@types+node@20.5.1/node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@20.5.1/node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/.pnpm/@types+node@20.5.1/node_modules/@types/node/globals.d.ts:4

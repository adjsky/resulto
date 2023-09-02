[resulto](README.md) / Exports

# resulto

## Table of contents

### Classes

- [Err](classes/Err.md)
- [Ok](classes/Ok.md)
- [ResultError](classes/ResultError.md)

### Interfaces

- [Result](interfaces/Result.md)

### Type Aliases

- [AsyncResult](modules.md#asyncresult)
- [ErrFn](modules.md#errfn)
- [ErrPredicate](modules.md#errpredicate)
- [Fn](modules.md#fn)
- [Predicate](modules.md#predicate)

### Functions

- [err](modules.md#err)
- [errAsync](modules.md#errasync)
- [fromPromise](modules.md#frompromise)
- [fromThrowable](modules.md#fromthrowable)
- [ok](modules.md#ok)
- [okAsync](modules.md#okasync)

## Type Aliases

### AsyncResult

Ƭ **AsyncResult**<`T`, `E`\>: { `and`: <U\>(`res`: [`Result`](interfaces/Result.md)<`U`, `E`\>) => [`AsyncResult`](modules.md#asyncresult)<`U`, `E`\> ; `andThen`: <U\>(`f`: [`Fn`](modules.md#fn)<`T`, [`Result`](interfaces/Result.md)<`U`, `E`\>\>) => [`AsyncResult`](modules.md#asyncresult)<`U`, `E`\> ; `asyncAndThen`: <U\>(`f`: [`Fn`](modules.md#fn)<`T`, `Promise`<[`Result`](interfaces/Result.md)<`U`, `E`\>\>\>) => [`AsyncResult`](modules.md#asyncresult)<`U`, `E`\> ; `asyncMap`: <U\>(`f`: [`Fn`](modules.md#fn)<`T`, `Promise`<`U`\>\>) => [`AsyncResult`](modules.md#asyncresult)<`U`, `E`\> ; `asyncMapErr`: <F\>(`f`: [`ErrFn`](modules.md#errfn)<`E`, `Promise`<`F`\>\>) => [`AsyncResult`](modules.md#asyncresult)<`T`, `F`\> ; `asyncMapOr`: <U\>(`value`: `U`, `f`: [`Fn`](modules.md#fn)<`T`, `Promise`<`U`\>\>) => `Promise`<`U`\> ; `asyncMapOrElse`: <U\>(`fallbackFn`: [`ErrFn`](modules.md#errfn)<`E`, `U` \| `Promise`<`U`\>\>, `f`: [`Fn`](modules.md#fn)<`T`, `U` \| `Promise`<`U`\>\>) => `Promise`<`U`\> ; `asyncMatch`: <U\>(`okFn`: [`Fn`](modules.md#fn)<`T`, `U` \| `Promise`<`U`\>\>, `errFn`: [`ErrFn`](modules.md#errfn)<`E`, `U` \| `Promise`<`U`\>\>) => `Promise`<`U`\> ; `asyncOrElse`: <F\>(`f`: [`ErrFn`](modules.md#errfn)<`E`, `Promise`<[`Result`](interfaces/Result.md)<`T`, `F`\>\>\>) => [`AsyncResult`](modules.md#asyncresult)<`T`, `F`\> ; `asyncUnwrapOrElse`: (`f`: [`ErrFn`](modules.md#errfn)<`E`, `Promise`<`T`\>\>) => `Promise`<`T`\> ; `expect`: (`msg`: `string`) => `Promise`<`T`\> ; `expectErr`: (`msg`: `string`) => `Promise`<`E`\> ; `inspect`: (`f`: [`Fn`](modules.md#fn)<`T`, `void`\>) => [`AsyncResult`](modules.md#asyncresult)<`T`, `E`\> ; `inspectErr`: (`f`: [`ErrFn`](modules.md#errfn)<`E`, `void`\>) => [`AsyncResult`](modules.md#asyncresult)<`T`, `E`\> ; `map`: <U\>(`f`: [`Fn`](modules.md#fn)<`T`, `U`\>) => [`AsyncResult`](modules.md#asyncresult)<`U`, `E`\> ; `mapErr`: <F\>(`f`: [`ErrFn`](modules.md#errfn)<`E`, `F`\>) => [`AsyncResult`](modules.md#asyncresult)<`T`, `F`\> ; `mapOr`: <U\>(`value`: `U`, `f`: [`Fn`](modules.md#fn)<`T`, `U`\>) => `Promise`<`U`\> ; `mapOrElse`: <U\>(`fallbackFn`: [`ErrFn`](modules.md#errfn)<`E`, `U`\>, `f`: [`Fn`](modules.md#fn)<`T`, `U`\>) => `Promise`<`U`\> ; `match`: <U\>(`okFn`: [`Fn`](modules.md#fn)<`T`, `U`\>, `errFn`: [`ErrFn`](modules.md#errfn)<`E`, `U`\>) => `Promise`<`U`\> ; `or`: <F\>(`res`: [`Result`](interfaces/Result.md)<`T`, `F`\>) => [`AsyncResult`](modules.md#asyncresult)<`T`, `F`\> ; `orElse`: <F\>(`f`: [`ErrFn`](modules.md#errfn)<`E`, [`Result`](interfaces/Result.md)<`T`, `F`\>\>) => [`AsyncResult`](modules.md#asyncresult)<`T`, `F`\> ; `unwrap`: () => `Promise`<`T`\> ; `unwrapErr`: () => `Promise`<`E`\> ; `unwrapOr`: (`value`: `T`) => `Promise`<`T`\> ; `unwrapOrElse`: (`f`: [`ErrFn`](modules.md#errfn)<`E`, `T`\>) => `Promise`<`T`\>  } & `Promise`<[`Result`](interfaces/Result.md)<`T`, `E`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |
| `E` |

#### Defined in

packages/resulto/src/result.ts:224

___

### ErrFn

Ƭ **ErrFn**<`E`, `F`\>: (`error`: `E`) => `F`

#### Type parameters

| Name |
| :------ |
| `E` |
| `F` |

#### Type declaration

▸ (`error`): `F`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `E` |

##### Returns

`F`

#### Defined in

packages/resulto/src/utility.ts:7

___

### ErrPredicate

Ƭ **ErrPredicate**<`T`\>: (`error`: `T`) => `boolean`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`error`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `T` |

##### Returns

`boolean`

#### Defined in

packages/resulto/src/utility.ts:3

___

### Fn

Ƭ **Fn**<`T`, `U`\>: (`value`: `T`) => `U`

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Type declaration

▸ (`value`): `U`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

##### Returns

`U`

#### Defined in

packages/resulto/src/utility.ts:5

___

### Predicate

Ƭ **Predicate**<`T`\>: (`value`: `T`) => `boolean`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`value`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

##### Returns

`boolean`

#### Defined in

packages/resulto/src/utility.ts:1

## Functions

### err

▸ **err**<`T`, `E`\>(`error`): [`Result`](interfaces/Result.md)<`T`, `E`\>

Creates an `Err` version of `Result`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `never` |
| `E` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `E` |

#### Returns

[`Result`](interfaces/Result.md)<`T`, `E`\>

#### Defined in

packages/resulto/src/result.ts:694

___

### errAsync

▸ **errAsync**<`T`, `E`\>(`error`): [`AsyncResult`](modules.md#asyncresult)<`T`, `E`\>

Creates an `Err` version of `AsyncResult`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |
| `E` | `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `E` \| `Promise`<`E`\> |

#### Returns

[`AsyncResult`](modules.md#asyncresult)<`T`, `E`\>

#### Defined in

packages/resulto/src/result.ts:701

___

### fromPromise

▸ **fromPromise**<`T`, `E`\>(`promise`, `errorFn?`): [`AsyncResult`](modules.md#asyncresult)<`T`, `E`\>

Accepts a promise and returns an `AsyncResult` containing either `Ok` with
the resolved value or `Err` with the rejected error.

You can optionally pass `errorFn` as the second argument to map rejected
error from `unknown` to `E`.

#### Type parameters

| Name |
| :------ |
| `T` |
| `E` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `promise` | `Promise`<`T`\> |
| `errorFn?` | [`ErrFn`](modules.md#errfn)<`unknown`, `E`\> |

#### Returns

[`AsyncResult`](modules.md#asyncresult)<`T`, `E`\>

#### Defined in

packages/resulto/src/result.ts:714

___

### fromThrowable

▸ **fromThrowable**<`T`, `E`\>(`f`, `errorFn?`): [`Result`](interfaces/Result.md)<`T`, `E`\>

Accepts a function `f` that may throw, and returns `Result` containing
either `Ok` with the value returned from `f` or `Err` with the thrown error.

You can optionally pass `errorFn` as the second argument to map the thrown
error from `unknown` to `E`.

#### Type parameters

| Name |
| :------ |
| `T` |
| `E` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Fn`](modules.md#fn)<`void`, `T`\> |
| `errorFn?` | [`ErrFn`](modules.md#errfn)<`unknown`, `E`\> |

#### Returns

[`Result`](interfaces/Result.md)<`T`, `E`\>

#### Defined in

packages/resulto/src/result.ts:728

___

### ok

▸ **ok**<`T`, `E`\>(`value`): [`Result`](interfaces/Result.md)<`T`, `E`\>

Creates an `Ok` version of `Result`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |
| `E` | `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

[`Result`](interfaces/Result.md)<`T`, `E`\>

#### Defined in

packages/resulto/src/result.ts:678

___

### okAsync

▸ **okAsync**<`T`, `E`\>(`value`): [`AsyncResult`](modules.md#asyncresult)<`T`, `E`\>

Creates an `Ok` version of `AsyncResult`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |
| `E` | `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` \| `Promise`<`T`\> |

#### Returns

[`AsyncResult`](modules.md#asyncresult)<`T`, `E`\>

#### Defined in

packages/resulto/src/result.ts:685

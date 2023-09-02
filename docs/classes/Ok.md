[resulto](../README.md) / [Exports](../modules.md) / Ok

# Class: Ok<T, E\>

## Type parameters

| Name |
| :------ |
| `T` |
| `E` |

## Implements

- [`Result`](../interfaces/Result.md)<`T`, `E`\>

## Table of contents

### Constructors

- [constructor](Ok.md#constructor)

### Properties

- [value](Ok.md#value)

### Methods

- [and](Ok.md#and)
- [andThen](Ok.md#andthen)
- [asyncAndThen](Ok.md#asyncandthen)
- [asyncMap](Ok.md#asyncmap)
- [asyncMapErr](Ok.md#asyncmaperr)
- [asyncMapOr](Ok.md#asyncmapor)
- [asyncMapOrElse](Ok.md#asyncmaporelse)
- [asyncMatch](Ok.md#asyncmatch)
- [asyncOrElse](Ok.md#asyncorelse)
- [asyncUnwrapOrElse](Ok.md#asyncunwraporelse)
- [expect](Ok.md#expect)
- [expectErr](Ok.md#expecterr)
- [inspect](Ok.md#inspect)
- [inspectErr](Ok.md#inspecterr)
- [isErr](Ok.md#iserr)
- [isErrAnd](Ok.md#iserrand)
- [isOk](Ok.md#isok)
- [isOkAnd](Ok.md#isokand)
- [map](Ok.md#map)
- [mapErr](Ok.md#maperr)
- [mapOr](Ok.md#mapor)
- [mapOrElse](Ok.md#maporelse)
- [match](Ok.md#match)
- [or](Ok.md#or)
- [orElse](Ok.md#orelse)
- [unwrap](Ok.md#unwrap)
- [unwrapErr](Ok.md#unwraperr)
- [unwrapOr](Ok.md#unwrapor)
- [unwrapOrElse](Ok.md#unwraporelse)

## Constructors

### constructor

• **new Ok**<`T`, `E`\>(`value`)

#### Type parameters

| Name |
| :------ |
| `T` |
| `E` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Defined in

packages/resulto/src/result.ts:426

## Properties

### value

• `Readonly` **value**: `T`

#### Defined in

packages/resulto/src/result.ts:426

## Methods

### and

▸ **and**<`U`\>(`res`): [`Result`](../interfaces/Result.md)<`U`, `E`\>

Returns `res` if the result is `Ok`, otherwise returns the `Err` value.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | [`Result`](../interfaces/Result.md)<`U`, `E`\> |

#### Returns

[`Result`](../interfaces/Result.md)<`U`, `E`\>

#### Implementation of

[Result](../interfaces/Result.md).[and](../interfaces/Result.md#and)

#### Defined in

packages/resulto/src/result.ts:505

___

### andThen

▸ **andThen**<`U`\>(`f`): [`Result`](../interfaces/Result.md)<`U`, `E`\>

Calls `f` if the result is `Ok`, otherwise returns the `Err` value.

This function can be used for control flow based on `Result` values.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Fn`](../modules.md#fn)<`T`, [`Result`](../interfaces/Result.md)<`U`, `E`\>\> |

#### Returns

[`Result`](../interfaces/Result.md)<`U`, `E`\>

#### Implementation of

[Result](../interfaces/Result.md).[andThen](../interfaces/Result.md#andthen)

#### Defined in

packages/resulto/src/result.ts:509

___

### asyncAndThen

▸ **asyncAndThen**<`U`\>(`f`): [`AsyncResult`](../modules.md#asyncresult)<`U`, `E`\>

Works similar to the [Result.andThen](../interfaces/Result.md#andthen) method, except that this
method returns `AsyncResult` instead of `Result`, and the function `f`
has to return `Promise`.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Fn`](../modules.md#fn)<`T`, `Promise`<[`Result`](../interfaces/Result.md)<`U`, `E`\>\>\> |

#### Returns

[`AsyncResult`](../modules.md#asyncresult)<`U`, `E`\>

**`See`**

[Result.andThen](../interfaces/Result.md#andthen) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncAndThen](../interfaces/Result.md#asyncandthen)

#### Defined in

packages/resulto/src/result.ts:513

___

### asyncMap

▸ **asyncMap**<`U`\>(`f`): [`AsyncResult`](../modules.md#asyncresult)<`U`, `E`\>

Works similar to the [Result.map](../interfaces/Result.md#map) method, except that this method
returns `AsyncResult` instead of `Result`, and the function `f` has to
return `Promise`.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Fn`](../modules.md#fn)<`T`, `Promise`<`U`\>\> |

#### Returns

[`AsyncResult`](../modules.md#asyncresult)<`U`, `E`\>

**`See`**

[Result.map](../interfaces/Result.md#map) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncMap](../interfaces/Result.md#asyncmap)

#### Defined in

packages/resulto/src/result.ts:448

___

### asyncMapErr

▸ **asyncMapErr**<`F`\>(): [`AsyncResult`](../modules.md#asyncresult)<`T`, `F`\>

Works similar to the [Result.mapErr](../interfaces/Result.md#maperr) method, except that this method
returns `AsyncResult` instead of `Result`, and the function `f` has to
return `Promise`.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Returns

[`AsyncResult`](../modules.md#asyncresult)<`T`, `F`\>

**`See`**

[Result.mapErr](../interfaces/Result.md#maperr) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncMapErr](../interfaces/Result.md#asyncmaperr)

#### Defined in

packages/resulto/src/result.ts:475

___

### asyncMapOr

▸ **asyncMapOr**<`U`\>(`_`, `f`): `Promise`<`U`\>

Works similar to the [Result.mapOr](../interfaces/Result.md#mapor) method, except that this method
returns `Promise`, and the function `f` has to return `Promise`.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `U` |
| `f` | [`Fn`](../modules.md#fn)<`T`, `Promise`<`U`\>\> |

#### Returns

`Promise`<`U`\>

**`See`**

[Result.mapOr](../interfaces/Result.md#mapor) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncMapOr](../interfaces/Result.md#asyncmapor)

#### Defined in

packages/resulto/src/result.ts:456

___

### asyncMapOrElse

▸ **asyncMapOrElse**<`U`\>(`_`, `f`): `Promise`<`U`\>

Works similar to the [Result.mapOrElse](../interfaces/Result.md#maporelse) method, except that this
method returns `Promise`, and functions `fallbackFn` and `f` can return
`Promise`.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | [`ErrFn`](../modules.md#errfn)<`E`, `U` \| `Promise`<`U`\>\> |
| `f` | [`Fn`](../modules.md#fn)<`T`, `U` \| `Promise`<`U`\>\> |

#### Returns

`Promise`<`U`\>

**`See`**

[Result.mapOrElse](../interfaces/Result.md#maporelse) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncMapOrElse](../interfaces/Result.md#asyncmaporelse)

#### Defined in

packages/resulto/src/result.ts:464

___

### asyncMatch

▸ **asyncMatch**<`U`\>(`okFn`): `Promise`<`U`\>

Works similar to the [Result.match](../interfaces/Result.md#match) method, except that this
method returns `Promise`, and functions `okFn` and `errFn` can return
`Promise`.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `okFn` | [`Fn`](../modules.md#fn)<`T`, `U` \| `Promise`<`U`\>\> |

#### Returns

`Promise`<`U`\>

**`See`**

[Result.match](../interfaces/Result.md#match) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncMatch](../interfaces/Result.md#asyncmatch)

#### Defined in

packages/resulto/src/result.ts:545

___

### asyncOrElse

▸ **asyncOrElse**<`F`\>(): [`AsyncResult`](../modules.md#asyncresult)<`T`, `F`\>

Works similar to the [Result.orElse](../interfaces/Result.md#orelse) method, except that this
method returns `AsyncResult` instead of `Result`, and the function `f`
has to return `Promise`.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Returns

[`AsyncResult`](../modules.md#asyncresult)<`T`, `F`\>

**`See`**

[Result.orElse](../interfaces/Result.md#orelse) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncOrElse](../interfaces/Result.md#asyncorelse)

#### Defined in

packages/resulto/src/result.ts:525

___

### asyncUnwrapOrElse

▸ **asyncUnwrapOrElse**(): `Promise`<`T`\>

Works similar to the [Result.unwrapOrElse](../interfaces/Result.md#unwraporelse) method, except that this
method returns `Promise`, and the function `f` has to return `Promise`.

#### Returns

`Promise`<`T`\>

**`See`**

[Result.unwrapOrElse](../interfaces/Result.md#unwraporelse) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncUnwrapOrElse](../interfaces/Result.md#asyncunwraporelse)

#### Defined in

packages/resulto/src/result.ts:537

___

### expect

▸ **expect**(): `T`

Returns the contained `Ok` value.

This function may throw `UnwrapError` (if `Err`).

#### Returns

`T`

#### Implementation of

[Result](../interfaces/Result.md).[expect](../interfaces/Result.md#expect)

#### Defined in

packages/resulto/src/result.ts:489

___

### expectErr

▸ **expectErr**(`msg`): `never`

Returns the contained `Err` value.

This function may throw `UnwrapError` (if `Ok`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `string` |

#### Returns

`never`

#### Implementation of

[Result](../interfaces/Result.md).[expectErr](../interfaces/Result.md#expecterr)

#### Defined in

packages/resulto/src/result.ts:497

___

### inspect

▸ **inspect**(`f`): [`Result`](../interfaces/Result.md)<`T`, `E`\>

Calls the provided function `f` with the contained value (if `Ok`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Fn`](../modules.md#fn)<`T`, `void`\> |

#### Returns

[`Result`](../interfaces/Result.md)<`T`, `E`\>

#### Implementation of

[Result](../interfaces/Result.md).[inspect](../interfaces/Result.md#inspect)

#### Defined in

packages/resulto/src/result.ts:479

___

### inspectErr

▸ **inspectErr**(): [`Result`](../interfaces/Result.md)<`T`, `E`\>

Calls the provided function `f` with the contained error (if `Err`).

#### Returns

[`Result`](../interfaces/Result.md)<`T`, `E`\>

#### Implementation of

[Result](../interfaces/Result.md).[inspectErr](../interfaces/Result.md#inspecterr)

#### Defined in

packages/resulto/src/result.ts:485

___

### isErr

▸ **isErr**(): this is Err<T, E\>

Checks if `Result` is `Err`.

#### Returns

this is Err<T, E\>

#### Implementation of

[Result](../interfaces/Result.md).[isErr](../interfaces/Result.md#iserr)

#### Defined in

packages/resulto/src/result.ts:436

___

### isErrAnd

▸ **isErrAnd**(): `boolean`

Checks if `Result` is `Err` and the value inside of it matches a predicate.

#### Returns

`boolean`

#### Implementation of

[Result](../interfaces/Result.md).[isErrAnd](../interfaces/Result.md#iserrand)

#### Defined in

packages/resulto/src/result.ts:440

___

### isOk

▸ **isOk**(): this is Ok<T, E\>

Checks if `Result` is `Ok`.

#### Returns

this is Ok<T, E\>

#### Implementation of

[Result](../interfaces/Result.md).[isOk](../interfaces/Result.md#isok)

#### Defined in

packages/resulto/src/result.ts:428

___

### isOkAnd

▸ **isOkAnd**(`f`): `boolean`

Checks if `Result` is `Ok` and the value inside of it matches a predicate.

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Predicate`](../modules.md#predicate)<`T`\> |

#### Returns

`boolean`

#### Implementation of

[Result](../interfaces/Result.md).[isOkAnd](../interfaces/Result.md#isokand)

#### Defined in

packages/resulto/src/result.ts:432

___

### map

▸ **map**<`U`\>(`f`): [`Result`](../interfaces/Result.md)<`U`, `E`\>

Maps a `Result<T, E>` to `Result<U, E>` by applying a function `f` to a
contained `Ok` value, leaving an `Err` value untouched.

This function can be used to compose the results of two functions.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Fn`](../modules.md#fn)<`T`, `U`\> |

#### Returns

[`Result`](../interfaces/Result.md)<`U`, `E`\>

#### Implementation of

[Result](../interfaces/Result.md).[map](../interfaces/Result.md#map)

#### Defined in

packages/resulto/src/result.ts:444

___

### mapErr

▸ **mapErr**<`F`\>(): [`Result`](../interfaces/Result.md)<`T`, `F`\>

Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a
contained `Err` value, leaving an `Ok` value untouched.

This function can be used to pass through a successful result while
handling an error.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Returns

[`Result`](../interfaces/Result.md)<`T`, `F`\>

#### Implementation of

[Result](../interfaces/Result.md).[mapErr](../interfaces/Result.md#maperr)

#### Defined in

packages/resulto/src/result.ts:471

___

### mapOr

▸ **mapOr**<`U`\>(`_`, `f`): `U`

Returns the provided `value` (if `Err`), or applies a function to the
contained value (if `Ok`).

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `U` |
| `f` | [`Fn`](../modules.md#fn)<`T`, `U`\> |

#### Returns

`U`

#### Implementation of

[Result](../interfaces/Result.md).[mapOr](../interfaces/Result.md#mapor)

#### Defined in

packages/resulto/src/result.ts:452

___

### mapOrElse

▸ **mapOrElse**<`U`\>(`_`, `f`): `U`

Maps a `Result<T, E>` to `U` by applying function `fallbackFn` to a
contained `Err` value, or function `f` to a contained `Ok` value.

This function can be used to unpack a successful result while handling an
error.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | [`ErrFn`](../modules.md#errfn)<`E`, `U`\> |
| `f` | [`Fn`](../modules.md#fn)<`T`, `U`\> |

#### Returns

`U`

#### Implementation of

[Result](../interfaces/Result.md).[mapOrElse](../interfaces/Result.md#maporelse)

#### Defined in

packages/resulto/src/result.ts:460

___

### match

▸ **match**<`U`\>(`okFn`): `U`

Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.

Both `okFn` and `errFn` must have the same return type.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `okFn` | [`Fn`](../modules.md#fn)<`T`, `U`\> |

#### Returns

`U`

#### Implementation of

[Result](../interfaces/Result.md).[match](../interfaces/Result.md#match)

#### Defined in

packages/resulto/src/result.ts:541

___

### or

▸ **or**<`F`\>(): [`Result`](../interfaces/Result.md)<`T`, `F`\>

Returns `res` if the result is `Err`, otherwise returns the `Ok` value.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Returns

[`Result`](../interfaces/Result.md)<`T`, `F`\>

#### Implementation of

[Result](../interfaces/Result.md).[or](../interfaces/Result.md#or)

#### Defined in

packages/resulto/src/result.ts:517

___

### orElse

▸ **orElse**<`F`\>(): [`Result`](../interfaces/Result.md)<`T`, `F`\>

Calls `f` if the result is `Err`, otherwise returns the `Ok` value.

This function can be used for control flow based on result values.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Returns

[`Result`](../interfaces/Result.md)<`T`, `F`\>

#### Implementation of

[Result](../interfaces/Result.md).[orElse](../interfaces/Result.md#orelse)

#### Defined in

packages/resulto/src/result.ts:521

___

### unwrap

▸ **unwrap**(): `T`

Returns the contained `Ok` value.

This function may throw `UnwrapError` (if `Err`).

#### Returns

`T`

#### Implementation of

[Result](../interfaces/Result.md).[unwrap](../interfaces/Result.md#unwrap)

#### Defined in

packages/resulto/src/result.ts:493

___

### unwrapErr

▸ **unwrapErr**(): `never`

Returns the contained `Err` value.

This function may throw `UnwrapError` (if `Ok`).

#### Returns

`never`

#### Implementation of

[Result](../interfaces/Result.md).[unwrapErr](../interfaces/Result.md#unwraperr)

#### Defined in

packages/resulto/src/result.ts:501

___

### unwrapOr

▸ **unwrapOr**(): `T`

Returns the contained `Ok` value or a provided `value`.

#### Returns

`T`

#### Implementation of

[Result](../interfaces/Result.md).[unwrapOr](../interfaces/Result.md#unwrapor)

#### Defined in

packages/resulto/src/result.ts:529

___

### unwrapOrElse

▸ **unwrapOrElse**(): `T`

Returns the contained `Ok `value or computes it from a `f`.

#### Returns

`T`

#### Implementation of

[Result](../interfaces/Result.md).[unwrapOrElse](../interfaces/Result.md#unwraporelse)

#### Defined in

packages/resulto/src/result.ts:533

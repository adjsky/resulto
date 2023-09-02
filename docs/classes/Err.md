[resulto](../README.md) / [Exports](../modules.md) / Err

# Class: Err<T, E\>

## Type parameters

| Name |
| :------ |
| `T` |
| `E` |

## Implements

- [`Result`](../interfaces/Result.md)<`T`, `E`\>

## Table of contents

### Constructors

- [constructor](Err.md#constructor)

### Properties

- [error](Err.md#error)

### Methods

- [and](Err.md#and)
- [andThen](Err.md#andthen)
- [asyncAndThen](Err.md#asyncandthen)
- [asyncMap](Err.md#asyncmap)
- [asyncMapErr](Err.md#asyncmaperr)
- [asyncMapOr](Err.md#asyncmapor)
- [asyncMapOrElse](Err.md#asyncmaporelse)
- [asyncMatch](Err.md#asyncmatch)
- [asyncOrElse](Err.md#asyncorelse)
- [asyncUnwrapOrElse](Err.md#asyncunwraporelse)
- [expect](Err.md#expect)
- [expectErr](Err.md#expecterr)
- [inspect](Err.md#inspect)
- [inspectErr](Err.md#inspecterr)
- [isErr](Err.md#iserr)
- [isErrAnd](Err.md#iserrand)
- [isOk](Err.md#isok)
- [isOkAnd](Err.md#isokand)
- [map](Err.md#map)
- [mapErr](Err.md#maperr)
- [mapOr](Err.md#mapor)
- [mapOrElse](Err.md#maporelse)
- [match](Err.md#match)
- [or](Err.md#or)
- [orElse](Err.md#orelse)
- [unwrap](Err.md#unwrap)
- [unwrapErr](Err.md#unwraperr)
- [unwrapOr](Err.md#unwrapor)
- [unwrapOrElse](Err.md#unwraporelse)

## Constructors

### constructor

• **new Err**<`T`, `E`\>(`error`)

#### Type parameters

| Name |
| :------ |
| `T` |
| `E` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `E` |

#### Defined in

packages/resulto/src/result.ts:551

## Properties

### error

• `Readonly` **error**: `E`

#### Defined in

packages/resulto/src/result.ts:551

## Methods

### and

▸ **and**<`U`\>(): [`Result`](../interfaces/Result.md)<`U`, `E`\>

Returns `res` if the result is `Ok`, otherwise returns the `Err` value.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Returns

[`Result`](../interfaces/Result.md)<`U`, `E`\>

#### Implementation of

[Result](../interfaces/Result.md).[and](../interfaces/Result.md#and)

#### Defined in

packages/resulto/src/result.ts:627

___

### andThen

▸ **andThen**<`U`\>(): [`Result`](../interfaces/Result.md)<`U`, `E`\>

Calls `f` if the result is `Ok`, otherwise returns the `Err` value.

This function can be used for control flow based on `Result` values.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Returns

[`Result`](../interfaces/Result.md)<`U`, `E`\>

#### Implementation of

[Result](../interfaces/Result.md).[andThen](../interfaces/Result.md#andthen)

#### Defined in

packages/resulto/src/result.ts:631

___

### asyncAndThen

▸ **asyncAndThen**<`U`\>(): [`AsyncResult`](../modules.md#asyncresult)<`U`, `E`\>

Works similar to the [Result.andThen](../interfaces/Result.md#andthen) method, except that this
method returns `AsyncResult` instead of `Result`, and the function `f`
has to return `Promise`.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Returns

[`AsyncResult`](../modules.md#asyncresult)<`U`, `E`\>

**`See`**

[Result.andThen](../interfaces/Result.md#andthen) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncAndThen](../interfaces/Result.md#asyncandthen)

#### Defined in

packages/resulto/src/result.ts:635

___

### asyncMap

▸ **asyncMap**<`U`\>(): [`AsyncResult`](../modules.md#asyncresult)<`U`, `E`\>

Works similar to the [Result.map](../interfaces/Result.md#map) method, except that this method
returns `AsyncResult` instead of `Result`, and the function `f` has to
return `Promise`.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Returns

[`AsyncResult`](../modules.md#asyncresult)<`U`, `E`\>

**`See`**

[Result.map](../interfaces/Result.md#map) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncMap](../interfaces/Result.md#asyncmap)

#### Defined in

packages/resulto/src/result.ts:573

___

### asyncMapErr

▸ **asyncMapErr**<`F`\>(`f`): [`AsyncResult`](../modules.md#asyncresult)<`T`, `F`\>

Works similar to the [Result.mapErr](../interfaces/Result.md#maperr) method, except that this method
returns `AsyncResult` instead of `Result`, and the function `f` has to
return `Promise`.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`ErrFn`](../modules.md#errfn)<`E`, `Promise`<`F`\>\> |

#### Returns

[`AsyncResult`](../modules.md#asyncresult)<`T`, `F`\>

**`See`**

[Result.mapErr](../interfaces/Result.md#maperr) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncMapErr](../interfaces/Result.md#asyncmaperr)

#### Defined in

packages/resulto/src/result.ts:597

___

### asyncMapOr

▸ **asyncMapOr**<`U`\>(`value`): `Promise`<`U`\>

Works similar to the [Result.mapOr](../interfaces/Result.md#mapor) method, except that this method
returns `Promise`, and the function `f` has to return `Promise`.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `U` |

#### Returns

`Promise`<`U`\>

**`See`**

[Result.mapOr](../interfaces/Result.md#mapor) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncMapOr](../interfaces/Result.md#asyncmapor)

#### Defined in

packages/resulto/src/result.ts:581

___

### asyncMapOrElse

▸ **asyncMapOrElse**<`U`\>(`fallbackFn`): `Promise`<`U`\>

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
| `fallbackFn` | [`ErrFn`](../modules.md#errfn)<`E`, `U` \| `Promise`<`U`\>\> |

#### Returns

`Promise`<`U`\>

**`See`**

[Result.mapOrElse](../interfaces/Result.md#maporelse) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncMapOrElse](../interfaces/Result.md#asyncmaporelse)

#### Defined in

packages/resulto/src/result.ts:589

___

### asyncMatch

▸ **asyncMatch**<`U`\>(`_`, `errFn`): `Promise`<`U`\>

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
| `_` | [`Fn`](../modules.md#fn)<`T`, `U` \| `Promise`<`U`\>\> |
| `errFn` | [`ErrFn`](../modules.md#errfn)<`E`, `U` \| `Promise`<`U`\>\> |

#### Returns

`Promise`<`U`\>

**`See`**

[Result.match](../interfaces/Result.md#match) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncMatch](../interfaces/Result.md#asyncmatch)

#### Defined in

packages/resulto/src/result.ts:667

___

### asyncOrElse

▸ **asyncOrElse**<`F`\>(`f`): [`AsyncResult`](../modules.md#asyncresult)<`T`, `F`\>

Works similar to the [Result.orElse](../interfaces/Result.md#orelse) method, except that this
method returns `AsyncResult` instead of `Result`, and the function `f`
has to return `Promise`.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`ErrFn`](../modules.md#errfn)<`E`, `Promise`<[`Result`](../interfaces/Result.md)<`T`, `F`\>\>\> |

#### Returns

[`AsyncResult`](../modules.md#asyncresult)<`T`, `F`\>

**`See`**

[Result.orElse](../interfaces/Result.md#orelse) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncOrElse](../interfaces/Result.md#asyncorelse)

#### Defined in

packages/resulto/src/result.ts:647

___

### asyncUnwrapOrElse

▸ **asyncUnwrapOrElse**(`f`): `Promise`<`T`\>

Works similar to the [Result.unwrapOrElse](../interfaces/Result.md#unwraporelse) method, except that this
method returns `Promise`, and the function `f` has to return `Promise`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`ErrFn`](../modules.md#errfn)<`E`, `Promise`<`T`\>\> |

#### Returns

`Promise`<`T`\>

**`See`**

[Result.unwrapOrElse](../interfaces/Result.md#unwraporelse) for details.

#### Implementation of

[Result](../interfaces/Result.md).[asyncUnwrapOrElse](../interfaces/Result.md#asyncunwraporelse)

#### Defined in

packages/resulto/src/result.ts:659

___

### expect

▸ **expect**(`msg`): `never`

Returns the contained `Ok` value.

This function may throw `UnwrapError` (if `Err`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `string` |

#### Returns

`never`

#### Implementation of

[Result](../interfaces/Result.md).[expect](../interfaces/Result.md#expect)

#### Defined in

packages/resulto/src/result.ts:611

___

### expectErr

▸ **expectErr**(): `E`

Returns the contained `Err` value.

This function may throw `UnwrapError` (if `Ok`).

#### Returns

`E`

#### Implementation of

[Result](../interfaces/Result.md).[expectErr](../interfaces/Result.md#expecterr)

#### Defined in

packages/resulto/src/result.ts:619

___

### inspect

▸ **inspect**(): [`Result`](../interfaces/Result.md)<`T`, `E`\>

Calls the provided function `f` with the contained value (if `Ok`).

#### Returns

[`Result`](../interfaces/Result.md)<`T`, `E`\>

#### Implementation of

[Result](../interfaces/Result.md).[inspect](../interfaces/Result.md#inspect)

#### Defined in

packages/resulto/src/result.ts:601

___

### inspectErr

▸ **inspectErr**(`f`): [`Result`](../interfaces/Result.md)<`T`, `E`\>

Calls the provided function `f` with the contained error (if `Err`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`ErrFn`](../modules.md#errfn)<`E`, `void`\> |

#### Returns

[`Result`](../interfaces/Result.md)<`T`, `E`\>

#### Implementation of

[Result](../interfaces/Result.md).[inspectErr](../interfaces/Result.md#inspecterr)

#### Defined in

packages/resulto/src/result.ts:605

___

### isErr

▸ **isErr**(): this is Err<T, E\>

Checks if `Result` is `Err`.

#### Returns

this is Err<T, E\>

#### Implementation of

[Result](../interfaces/Result.md).[isErr](../interfaces/Result.md#iserr)

#### Defined in

packages/resulto/src/result.ts:561

___

### isErrAnd

▸ **isErrAnd**(`f`): `boolean`

Checks if `Result` is `Err` and the value inside of it matches a predicate.

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Predicate`](../modules.md#predicate)<`E`\> |

#### Returns

`boolean`

#### Implementation of

[Result](../interfaces/Result.md).[isErrAnd](../interfaces/Result.md#iserrand)

#### Defined in

packages/resulto/src/result.ts:565

___

### isOk

▸ **isOk**(): this is Ok<T, E\>

Checks if `Result` is `Ok`.

#### Returns

this is Ok<T, E\>

#### Implementation of

[Result](../interfaces/Result.md).[isOk](../interfaces/Result.md#isok)

#### Defined in

packages/resulto/src/result.ts:553

___

### isOkAnd

▸ **isOkAnd**(): `boolean`

Checks if `Result` is `Ok` and the value inside of it matches a predicate.

#### Returns

`boolean`

#### Implementation of

[Result](../interfaces/Result.md).[isOkAnd](../interfaces/Result.md#isokand)

#### Defined in

packages/resulto/src/result.ts:557

___

### map

▸ **map**<`U`\>(): [`Result`](../interfaces/Result.md)<`U`, `E`\>

Maps a `Result<T, E>` to `Result<U, E>` by applying a function `f` to a
contained `Ok` value, leaving an `Err` value untouched.

This function can be used to compose the results of two functions.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Returns

[`Result`](../interfaces/Result.md)<`U`, `E`\>

#### Implementation of

[Result](../interfaces/Result.md).[map](../interfaces/Result.md#map)

#### Defined in

packages/resulto/src/result.ts:569

___

### mapErr

▸ **mapErr**<`F`\>(`f`): [`Result`](../interfaces/Result.md)<`T`, `F`\>

Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a
contained `Err` value, leaving an `Ok` value untouched.

This function can be used to pass through a successful result while
handling an error.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`ErrFn`](../modules.md#errfn)<`E`, `F`\> |

#### Returns

[`Result`](../interfaces/Result.md)<`T`, `F`\>

#### Implementation of

[Result](../interfaces/Result.md).[mapErr](../interfaces/Result.md#maperr)

#### Defined in

packages/resulto/src/result.ts:593

___

### mapOr

▸ **mapOr**<`U`\>(`value`): `U`

Returns the provided `value` (if `Err`), or applies a function to the
contained value (if `Ok`).

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `U` |

#### Returns

`U`

#### Implementation of

[Result](../interfaces/Result.md).[mapOr](../interfaces/Result.md#mapor)

#### Defined in

packages/resulto/src/result.ts:577

___

### mapOrElse

▸ **mapOrElse**<`U`\>(`fallback`): `U`

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
| `fallback` | [`ErrFn`](../modules.md#errfn)<`E`, `U`\> |

#### Returns

`U`

#### Implementation of

[Result](../interfaces/Result.md).[mapOrElse](../interfaces/Result.md#maporelse)

#### Defined in

packages/resulto/src/result.ts:585

___

### match

▸ **match**<`U`\>(`_`, `errFn`): `U`

Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.

Both `okFn` and `errFn` must have the same return type.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | [`Fn`](../modules.md#fn)<`T`, `U`\> |
| `errFn` | [`ErrFn`](../modules.md#errfn)<`E`, `U`\> |

#### Returns

`U`

#### Implementation of

[Result](../interfaces/Result.md).[match](../interfaces/Result.md#match)

#### Defined in

packages/resulto/src/result.ts:663

___

### or

▸ **or**<`F`\>(`res`): [`Result`](../interfaces/Result.md)<`T`, `F`\>

Returns `res` if the result is `Err`, otherwise returns the `Ok` value.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | [`Result`](../interfaces/Result.md)<`T`, `F`\> |

#### Returns

[`Result`](../interfaces/Result.md)<`T`, `F`\>

#### Implementation of

[Result](../interfaces/Result.md).[or](../interfaces/Result.md#or)

#### Defined in

packages/resulto/src/result.ts:639

___

### orElse

▸ **orElse**<`F`\>(`f`): [`Result`](../interfaces/Result.md)<`T`, `F`\>

Calls `f` if the result is `Err`, otherwise returns the `Ok` value.

This function can be used for control flow based on result values.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`ErrFn`](../modules.md#errfn)<`E`, [`Result`](../interfaces/Result.md)<`T`, `F`\>\> |

#### Returns

[`Result`](../interfaces/Result.md)<`T`, `F`\>

#### Implementation of

[Result](../interfaces/Result.md).[orElse](../interfaces/Result.md#orelse)

#### Defined in

packages/resulto/src/result.ts:643

___

### unwrap

▸ **unwrap**(): `never`

Returns the contained `Ok` value.

This function may throw `UnwrapError` (if `Err`).

#### Returns

`never`

#### Implementation of

[Result](../interfaces/Result.md).[unwrap](../interfaces/Result.md#unwrap)

#### Defined in

packages/resulto/src/result.ts:615

___

### unwrapErr

▸ **unwrapErr**(): `E`

Returns the contained `Err` value.

This function may throw `UnwrapError` (if `Ok`).

#### Returns

`E`

#### Implementation of

[Result](../interfaces/Result.md).[unwrapErr](../interfaces/Result.md#unwraperr)

#### Defined in

packages/resulto/src/result.ts:623

___

### unwrapOr

▸ **unwrapOr**(`value`): `T`

Returns the contained `Ok` value or a provided `value`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`T`

#### Implementation of

[Result](../interfaces/Result.md).[unwrapOr](../interfaces/Result.md#unwrapor)

#### Defined in

packages/resulto/src/result.ts:651

___

### unwrapOrElse

▸ **unwrapOrElse**(`f`): `T`

Returns the contained `Ok `value or computes it from a `f`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`ErrFn`](../modules.md#errfn)<`E`, `T`\> |

#### Returns

`T`

#### Implementation of

[Result](../interfaces/Result.md).[unwrapOrElse](../interfaces/Result.md#unwraporelse)

#### Defined in

packages/resulto/src/result.ts:655

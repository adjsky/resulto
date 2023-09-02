[resulto](../README.md) / [Exports](../modules.md) / Result

# Interface: Result<T, E\>

## Type parameters

| Name |
| :------ |
| `T` |
| `E` |

## Implemented by

- [`Err`](../classes/Err.md)
- [`Ok`](../classes/Ok.md)

## Table of contents

### Methods

- [and](Result.md#and)
- [andThen](Result.md#andthen)
- [asyncAndThen](Result.md#asyncandthen)
- [asyncMap](Result.md#asyncmap)
- [asyncMapErr](Result.md#asyncmaperr)
- [asyncMapOr](Result.md#asyncmapor)
- [asyncMapOrElse](Result.md#asyncmaporelse)
- [asyncMatch](Result.md#asyncmatch)
- [asyncOrElse](Result.md#asyncorelse)
- [asyncUnwrapOrElse](Result.md#asyncunwraporelse)
- [expect](Result.md#expect)
- [expectErr](Result.md#expecterr)
- [inspect](Result.md#inspect)
- [inspectErr](Result.md#inspecterr)
- [isErr](Result.md#iserr)
- [isErrAnd](Result.md#iserrand)
- [isOk](Result.md#isok)
- [isOkAnd](Result.md#isokand)
- [map](Result.md#map)
- [mapErr](Result.md#maperr)
- [mapOr](Result.md#mapor)
- [mapOrElse](Result.md#maporelse)
- [match](Result.md#match)
- [or](Result.md#or)
- [orElse](Result.md#orelse)
- [unwrap](Result.md#unwrap)
- [unwrapErr](Result.md#unwraperr)
- [unwrapOr](Result.md#unwrapor)
- [unwrapOrElse](Result.md#unwraporelse)

## Methods

### and

▸ **and**<`U`\>(`res`): [`Result`](Result.md)<`U`, `E`\>

Returns `res` if the result is `Ok`, otherwise returns the `Err` value.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | [`Result`](Result.md)<`U`, `E`\> |

#### Returns

[`Result`](Result.md)<`U`, `E`\>

#### Defined in

packages/resulto/src/result.ts:142

___

### andThen

▸ **andThen**<`U`\>(`f`): [`Result`](Result.md)<`U`, `E`\>

Calls `f` if the result is `Ok`, otherwise returns the `Err` value.

This function can be used for control flow based on `Result` values.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Fn`](../modules.md#fn)<`T`, [`Result`](Result.md)<`U`, `E`\>\> |

#### Returns

[`Result`](Result.md)<`U`, `E`\>

#### Defined in

packages/resulto/src/result.ts:149

___

### asyncAndThen

▸ **asyncAndThen**<`U`\>(`f`): [`AsyncResult`](../modules.md#asyncresult)<`U`, `E`\>

Works similar to the [Result.andThen](Result.md#andthen) method, except that this
method returns `AsyncResult` instead of `Result`, and the function `f`
has to return `Promise`.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Fn`](../modules.md#fn)<`T`, `Promise`<[`Result`](Result.md)<`U`, `E`\>\>\> |

#### Returns

[`AsyncResult`](../modules.md#asyncresult)<`U`, `E`\>

**`See`**

[Result.andThen](Result.md#andthen) for details.

#### Defined in

packages/resulto/src/result.ts:158

___

### asyncMap

▸ **asyncMap**<`U`\>(`f`): [`AsyncResult`](../modules.md#asyncresult)<`U`, `E`\>

Works similar to the [Result.map](Result.md#map) method, except that this method
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

[Result.map](Result.md#map) for details.

#### Defined in

packages/resulto/src/result.ts:46

___

### asyncMapErr

▸ **asyncMapErr**<`F`\>(`f`): [`AsyncResult`](../modules.md#asyncresult)<`T`, `F`\>

Works similar to the [Result.mapErr](Result.md#maperr) method, except that this method
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

[Result.mapErr](Result.md#maperr) for details.

#### Defined in

packages/resulto/src/result.ts:99

___

### asyncMapOr

▸ **asyncMapOr**<`U`\>(`value`, `f`): `Promise`<`U`\>

Works similar to the [Result.mapOr](Result.md#mapor) method, except that this method
returns `Promise`, and the function `f` has to return `Promise`.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `U` |
| `f` | [`Fn`](../modules.md#fn)<`T`, `Promise`<`U`\>\> |

#### Returns

`Promise`<`U`\>

**`See`**

[Result.mapOr](Result.md#mapor) for details.

#### Defined in

packages/resulto/src/result.ts:60

___

### asyncMapOrElse

▸ **asyncMapOrElse**<`U`\>(`fallbackFn`, `f`): `Promise`<`U`\>

Works similar to the [Result.mapOrElse](Result.md#maporelse) method, except that this
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
| `f` | [`Fn`](../modules.md#fn)<`T`, `U` \| `Promise`<`U`\>\> |

#### Returns

`Promise`<`U`\>

**`See`**

[Result.mapOrElse](Result.md#maporelse) for details.

#### Defined in

packages/resulto/src/result.ts:78

___

### asyncMatch

▸ **asyncMatch**<`U`\>(`okFn`, `errFn`): `Promise`<`U`\>

Works similar to the [Result.match](Result.md#match) method, except that this
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
| `errFn` | [`ErrFn`](../modules.md#errfn)<`E`, `U` \| `Promise`<`U`\>\> |

#### Returns

`Promise`<`U`\>

**`See`**

[Result.match](Result.md#match) for details.

#### Defined in

packages/resulto/src/result.ts:213

___

### asyncOrElse

▸ **asyncOrElse**<`F`\>(`f`): [`AsyncResult`](../modules.md#asyncresult)<`T`, `F`\>

Works similar to the [Result.orElse](Result.md#orelse) method, except that this
method returns `AsyncResult` instead of `Result`, and the function `f`
has to return `Promise`.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`ErrFn`](../modules.md#errfn)<`E`, `Promise`<[`Result`](Result.md)<`T`, `F`\>\>\> |

#### Returns

[`AsyncResult`](../modules.md#asyncresult)<`T`, `F`\>

**`See`**

[Result.orElse](Result.md#orelse) for details.

#### Defined in

packages/resulto/src/result.ts:179

___

### asyncUnwrapOrElse

▸ **asyncUnwrapOrElse**(`f`): `Promise`<`T`\>

Works similar to the [Result.unwrapOrElse](Result.md#unwraporelse) method, except that this
method returns `Promise`, and the function `f` has to return `Promise`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`ErrFn`](../modules.md#errfn)<`E`, `Promise`<`T`\>\> |

#### Returns

`Promise`<`T`\>

**`See`**

[Result.unwrapOrElse](Result.md#unwraporelse) for details.

#### Defined in

packages/resulto/src/result.ts:197

___

### expect

▸ **expect**(`msg`): `T`

Returns the contained `Ok` value.

This function may throw `UnwrapError` (if `Err`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `string` |

#### Returns

`T`

#### Defined in

packages/resulto/src/result.ts:116

___

### expectErr

▸ **expectErr**(`msg`): `E`

Returns the contained `Err` value.

This function may throw `UnwrapError` (if `Ok`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `string` |

#### Returns

`E`

#### Defined in

packages/resulto/src/result.ts:130

___

### inspect

▸ **inspect**(`f`): [`Result`](Result.md)<`T`, `E`\>

Calls the provided function `f` with the contained value (if `Ok`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Fn`](../modules.md#fn)<`T`, `void`\> |

#### Returns

[`Result`](Result.md)<`T`, `E`\>

#### Defined in

packages/resulto/src/result.ts:104

___

### inspectErr

▸ **inspectErr**(`f`): [`Result`](Result.md)<`T`, `E`\>

Calls the provided function `f` with the contained error (if `Err`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`ErrFn`](../modules.md#errfn)<`E`, `void`\> |

#### Returns

[`Result`](Result.md)<`T`, `E`\>

#### Defined in

packages/resulto/src/result.ts:109

___

### isErr

▸ **isErr**(): this is Err<T, E\>

Checks if `Result` is `Err`.

#### Returns

this is Err<T, E\>

#### Defined in

packages/resulto/src/result.ts:24

___

### isErrAnd

▸ **isErrAnd**(`f`): `boolean`

Checks if `Result` is `Err` and the value inside of it matches a predicate.

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`ErrPredicate`](../modules.md#errpredicate)<`E`\> |

#### Returns

`boolean`

#### Defined in

packages/resulto/src/result.ts:29

___

### isOk

▸ **isOk**(): this is Ok<T, E\>

Checks if `Result` is `Ok`.

#### Returns

this is Ok<T, E\>

#### Defined in

packages/resulto/src/result.ts:14

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

#### Defined in

packages/resulto/src/result.ts:19

___

### map

▸ **map**<`U`\>(`f`): [`Result`](Result.md)<`U`, `E`\>

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

[`Result`](Result.md)<`U`, `E`\>

#### Defined in

packages/resulto/src/result.ts:37

___

### mapErr

▸ **mapErr**<`F`\>(`f`): [`Result`](Result.md)<`T`, `F`\>

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

[`Result`](Result.md)<`T`, `F`\>

#### Defined in

packages/resulto/src/result.ts:90

___

### mapOr

▸ **mapOr**<`U`\>(`value`, `f`): `U`

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
| `f` | [`Fn`](../modules.md#fn)<`T`, `U`\> |

#### Returns

`U`

#### Defined in

packages/resulto/src/result.ts:52

___

### mapOrElse

▸ **mapOrElse**<`U`\>(`fallbackFn`, `f`): `U`

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
| `fallbackFn` | [`ErrFn`](../modules.md#errfn)<`E`, `U`\> |
| `f` | [`Fn`](../modules.md#fn)<`T`, `U`\> |

#### Returns

`U`

#### Defined in

packages/resulto/src/result.ts:69

___

### match

▸ **match**<`U`\>(`okFn`, `errFn`): `U`

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
| `errFn` | [`ErrFn`](../modules.md#errfn)<`E`, `U`\> |

#### Returns

`U`

#### Defined in

packages/resulto/src/result.ts:204

___

### or

▸ **or**<`F`\>(`res`): [`Result`](Result.md)<`T`, `F`\>

Returns `res` if the result is `Err`, otherwise returns the `Ok` value.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | [`Result`](Result.md)<`T`, `F`\> |

#### Returns

[`Result`](Result.md)<`T`, `F`\>

#### Defined in

packages/resulto/src/result.ts:163

___

### orElse

▸ **orElse**<`F`\>(`f`): [`Result`](Result.md)<`T`, `F`\>

Calls `f` if the result is `Err`, otherwise returns the `Ok` value.

This function can be used for control flow based on result values.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`ErrFn`](../modules.md#errfn)<`E`, [`Result`](Result.md)<`T`, `F`\>\> |

#### Returns

[`Result`](Result.md)<`T`, `F`\>

#### Defined in

packages/resulto/src/result.ts:170

___

### unwrap

▸ **unwrap**(): `T`

Returns the contained `Ok` value.

This function may throw `UnwrapError` (if `Err`).

#### Returns

`T`

#### Defined in

packages/resulto/src/result.ts:123

___

### unwrapErr

▸ **unwrapErr**(): `E`

Returns the contained `Err` value.

This function may throw `UnwrapError` (if `Ok`).

#### Returns

`E`

#### Defined in

packages/resulto/src/result.ts:137

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

#### Defined in

packages/resulto/src/result.ts:184

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

#### Defined in

packages/resulto/src/result.ts:189

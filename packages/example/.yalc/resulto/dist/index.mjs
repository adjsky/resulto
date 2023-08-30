function chain(chainHead) {
  let currentPromise = Promise.resolve(chainHead);
  let currentThis;

  const proxy = new Proxy(function () {}, {
    get(_, property) {
      switch (property) {
        case "then":
        case "catch":
        case "finally":
          return (...args) => currentPromise[property](...args)
        default:
          currentPromise = currentPromise.then((resolvedObject) => {
            currentThis = resolvedObject;

            return resolvedObject[property]
          });

          return proxy
      }
    },
    apply(_, __, args) {
      currentPromise = currentPromise.then((resolvedFunction) =>
        Reflect.apply(resolvedFunction, currentThis, args)
      );

      return proxy
    }
  });

  return proxy
}

class ResultError extends Error {
  constructor(message, data) {
    super(message);
    this.data = data;
  }
}

class Ok {
  constructor(value) {
    this.value = value;
    this.__internal_resulto = true;
  }
  isOk() {
    return true;
  }
  isOkAnd(f) {
    return f(this.value);
  }
  isErr() {
    return false;
  }
  isErrAnd() {
    return false;
  }
  map(f) {
    return ok(f(this.value));
  }
  asyncMap(f) {
    return chain(f(this.value).then(ok));
  }
  mapOr(_, f) {
    return f(this.value);
  }
  asyncMapOr(_, f) {
    return chain(f(this.value).then(ok));
  }
  mapOrElse(_, f) {
    return f(this.value);
  }
  asyncMapOrElse(_, f) {
    return Promise.resolve(f(this.value));
  }
  mapErr() {
    return ok(this.value);
  }
  asyncMapErr() {
    return chain(ok(this.value));
  }
  inspect(f) {
    f(this.value);
    return ok(this.value);
  }
  inspectErr() {
    return ok(this.value);
  }
  expect() {
    return this.value;
  }
  unwrap() {
    return this.value;
  }
  expectErr(msg) {
    throw new ResultError(msg, this.value);
  }
  unwrapErr() {
    throw new ResultError("Called `unwrapErr` on `Ok`", this.value);
  }
  and(res) {
    return res;
  }
  andThen(f) {
    return f(this.value);
  }
  asyncAndThen(f) {
    return chain(f(this.value));
  }
  or() {
    return ok(this.value);
  }
  orElse() {
    return ok(this.value);
  }
  asyncOrElse() {
    return chain(ok(this.value));
  }
  unwrapOr() {
    return this.value;
  }
  unwrapOrElse() {
    return this.value;
  }
  asyncUnwrapOrElse() {
    return Promise.resolve(this.value);
  }
  match(okFn) {
    return okFn(this.value);
  }
  asyncMatch(okFn) {
    return Promise.resolve(okFn(this.value));
  }
}
class Err {
  constructor(error) {
    this.error = error;
    this.__internal_resulto = true;
  }
  isOk() {
    return false;
  }
  isOkAnd() {
    return false;
  }
  isErr() {
    return true;
  }
  isErrAnd(f) {
    return f(this.error);
  }
  map() {
    return err(this.error);
  }
  asyncMap() {
    return chain(err(this.error));
  }
  mapOr(value) {
    return value;
  }
  asyncMapOr(value) {
    return Promise.resolve(value);
  }
  mapOrElse(fallback) {
    return fallback(this.error);
  }
  asyncMapOrElse(fallbackFn) {
    return Promise.resolve(fallbackFn(this.error));
  }
  mapErr(f) {
    return err(f(this.error));
  }
  asyncMapErr(f) {
    return chain(f(this.error).then(ok));
  }
  inspect() {
    return err(this.error);
  }
  inspectErr(f) {
    f(this.error);
    return err(this.error);
  }
  expect(msg) {
    throw new ResultError(msg, this.error);
  }
  unwrap() {
    throw new ResultError("Called `unwrap` on `Err`", this.error);
  }
  expectErr() {
    return this.error;
  }
  unwrapErr() {
    return this.error;
  }
  and() {
    return err(this.error);
  }
  andThen() {
    return err(this.error);
  }
  asyncAndThen() {
    return chain(err(this.error));
  }
  or(res) {
    return res;
  }
  orElse(f) {
    return f(this.error);
  }
  asyncOrElse(f) {
    return chain(f(this.error).then(ok));
  }
  unwrapOr(value) {
    return value;
  }
  unwrapOrElse(f) {
    return f(this.error);
  }
  asyncUnwrapOrElse(f) {
    return f(this.error);
  }
  match(_, errFn) {
    return errFn(this.error);
  }
  asyncMatch(_, errFn) {
    return Promise.resolve(errFn(this.error));
  }
}
function ok(value) {
  return new Ok(value);
}
function okAsync(value) {
  return chain(Promise.resolve(value).then(ok));
}
function err(error) {
  return new Err(error);
}
function errAsync(error) {
  return chain(Promise.resolve(error).then(err));
}
function fromPromise(promise, errorFn) {
  return chain(promise.then(ok).catch((e) => err(errorFn ? errorFn(e) : e)));
}
function fromThrowable(f, errorFn) {
  try {
    return ok(f());
  } catch (e) {
    return err(errorFn ? errorFn(e) : e);
  }
}

export { ResultError, err, errAsync, fromPromise, fromThrowable, ok, okAsync };

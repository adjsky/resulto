export {
  type AsyncResult,
  type Result,
  type ResultDeclarations,
  Ok,
  Err,
  fromPromise,
  fromThrowable,
  okAsync,
  ok,
  err,
  errAsync
} from "./result"
export {
  ResultError,
  type ErrFn,
  type ErrPredicate,
  type Fn,
  type Predicate
} from "./utility"

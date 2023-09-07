import type { Result } from "./result"

export type Predicate<T> = (value: T) => boolean

export type ErrPredicate<T> = (error: T) => boolean

export type Fn<T, U> = (value: T) => U

export type ErrFn<E, F> = (error: E) => F

export type UnwrapOks<T extends Result<unknown, unknown>[]> = {
  [i in keyof T]: T[i] extends Result<infer U, unknown> ? U : never
}

export type UnwrapErrs<T extends Result<unknown, unknown>[]> = {
  [i in keyof T]: T[i] extends Result<unknown, infer U> ? U : never
}

export class ResultError extends Error {
  data: unknown

  constructor(message: string, data: unknown) {
    super(message)

    this.data = data
  }
}

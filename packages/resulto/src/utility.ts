export type Predicate<T> = (value: T) => boolean

export type ErrPredicate<T> = (error: T) => boolean

export type Fn<T, U> = (value: T) => U

export type ErrFn<E, F> = (error: E) => F

export class ResultError extends Error {
  data: unknown

  constructor(message: string, data: unknown) {
    super(message)

    this.data = data
  }
}

export function injectCode(code: string) {
  return `
interface Result<T, E> {}

declare function ok<T = unknown, E = never>(value: T): Result<T, E>

declare function err<T = never, E = unknown>(error: E): Result<T, E> 

import { ok, err } from "resulto"

${code}
`
}

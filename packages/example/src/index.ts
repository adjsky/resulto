import { err, ok } from "resulto"

ok(4)

let result = err(4)

function get() {
  return ok(1)
}

get()

const resultFromFn = get()

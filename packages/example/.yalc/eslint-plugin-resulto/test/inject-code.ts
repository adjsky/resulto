export function injectCode(code: string) {
  return `
    class Ok {
      private __internal_resulto = true
    }

    class Err {
      private __internal_resulto = true
    }

    ${code}
  `
}

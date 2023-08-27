export function chain(chainHead) {
  let currentPromise = Promise.resolve(chainHead)
  let currentThis

  const proxy = new Proxy(function () {}, {
    get(_, property) {
      switch (property) {
        case "then":
        case "catch":
        case "finally":
          return (...args) => currentPromise[property](...args)
        default:
          currentPromise = currentPromise.then((resolvedObject) => {
            currentThis = resolvedObject

            return resolvedObject[property]
          })

          return proxy
      }
    },
    apply(_, __, args) {
      currentPromise = currentPromise.then((resolvedFunction) =>
        Reflect.apply(resolvedFunction, currentThis, args)
      )

      return proxy
    }
  })

  return proxy
}

const matcher = /^[\r\n]?(\s+)/

export function trimLeadingIndent(str: string) {
  const matched = str.match(matcher)

  if (!matched) {
    return str
  }

  return str.replace(new RegExp("^" + matched[1], "gm"), "").trim()
}

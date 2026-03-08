export const mapRule = <T extends string>(
  rule: (v?: string) => true | T,
  map: Record<T, string>,
  t: (key: string) => string
) => {
  return (v?: string) => {
    const result = rule(v)

    if (result === true) return true

    if (!(result in map)) {
      return true
    }

    return t(map[result as T])
  }
}

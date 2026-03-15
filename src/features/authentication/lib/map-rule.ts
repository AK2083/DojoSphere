/**
 * Wraps a validation rule and maps its error codes to translated messages.
 *
 * The provided `rule` function returns either `true` (validation passed)
 * or an error code of type `T`. If an error code is returned, it will be
 * mapped to a translation key using the provided `map` and then translated
 * using the `t` function.
 *
 * If the returned error code does not exist in the map, the validation
 * will be treated as successful (`true`).
 *
 * @template T
 * @param {(v?: string) => true | T} rule
 * Validation function that returns `true` if valid or an error code of type `T`.
 *
 * @param {Record<T, string>} map
 * Mapping of validation error codes to translation keys.
 *
 * @param {(key: string) => string} t
 * Translation function used to resolve translation keys to localized messages.
 *
 * @returns {(v?: string) => true | string}
 * A wrapped validation function that returns `true` if valid,
 * otherwise the translated validation message.
 */
export const mapRule = <T extends string>(
  rule: (v?: string) => true | T,
  map: Record<T, string>,
  t: (key: string) => string
): ((v?: string) => true | string) => {
  return (v?: string) => {
    const result = rule(v)

    if (result === true) return true

    const key = map[result]

    if (!key) {
      return true
    }

    return t(key)
  }
}

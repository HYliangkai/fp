export type Own<T> = T extends boolean ? OwnBoolean
  : (T extends number ? OwnNumber
    : (T extends Array<unknown> ? OwnArray<unknown> : OwnOther<T>))

/** @array */
type OwnArray<T> = Omit<
  OwnOther<Array<T>> & {
    is_empty(): Own<boolean>
  },
  'is_array'
>

/** @number */
type OwnNumber = Omit<
  OwnOther<number> & {
    is_nan(): Own<boolean>
  },
  ''
>

/** @boolean */
type OwnBoolean = Omit<
  OwnOther<boolean> & {
    match(true_handle?: () => void, false_handle?: () => void): Own<boolean>
    match_map<T>(
      true_handle: (val: true) => T,
      false_handle: (val: false) => T,
    ): Own<T>
  },
  ''
>

/** @all */
interface OwnOther<T> {
  readonly value: T
  take(): T
  is_array(): Own<boolean>
  map<V>(
    fn: (value: T) => V,
  ): Own<V>
}

export function Own<T>(value: T): Own<T> {
  const own = {
    value,
    take: () => value,
    is_array: () => Own(Array.isArray(value)),
    map: (fn: (val: T) => unknown) => Own(fn(value)),
  }
  /** @ArrayCase */
  if (Array.isArray(value)) {
    //@ts-ignore
    return {
      ...own,
      is_empty: () => Own(value.length === 0),
    } as Own<unknown>
  } /** @BooleanCase */
  else if (typeof value === 'boolean') {
    //@ts-ignore
    return {
      ...own,
      match: (t = () => {}, f = () => {}) => {
        value ? t() : f()
        return Own(value)
      },
      match_map: (t, f) => {
        return Own(
          value ? t(true) : f(false),
        )
      },
    }
  } /** @NumberCase */
  else if (typeof value === 'number') {
    //@ts-ignore
    return {
      ...own,
      is_nan: () => Own(isNaN(value)),
    }
  } /** @OtherCase */
  else return own as Own<T>
}

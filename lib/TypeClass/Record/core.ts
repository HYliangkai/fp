import { is_record, is_refer, is_tuple } from '@chzky/fp'

/** 对Record进行类型检查 */
export function record_type_check(val: object): void {
  if (typeof val !== 'object') throw new TypeError('Record must be an object ')
  if (val === null) throw new TypeError('Record must be an object ')
  if (Reflect.ownKeys(val).length === 0)
    throw new TypeError('Record must have at least one element')

  for (const key of Reflect.ownKeys(val)) {
    const value = Reflect.get(val, key)

    if (typeof key !== 'string') throw new TypeError('Record key must be a string')

    if (is_record(value) || is_tuple(value) || is_refer(value)) continue

    if (
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      typeof value !== 'boolean' &&
      typeof value !== 'object'
    )
      throw new TypeError('Record value must be a string | number | boolean | object')
  }
}

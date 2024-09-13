import { is_record, is_refer, is_tuple } from '@chzky/fp'

/** 对TupleArray进行类型检查 */
export function tuple_type_check(val: Array<any>): void {
  if (!Array.isArray(val)) throw new TypeError('TupleArray must be an array')
  if (val.length === 0) throw new TypeError('TupleArray must have at least one element')

  for (const item of val) {
    if (is_record(item) || is_refer(item) || is_tuple(item)) continue

    if (
      typeof item !== 'string' &&
      typeof item !== 'number' &&
      typeof item !== 'boolean' &&
      typeof item !== 'object'
    )
      throw new TypeError('Record value must be a string | number | boolean | object')
  }
}

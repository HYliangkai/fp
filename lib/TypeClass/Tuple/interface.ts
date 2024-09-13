import type { Record, RecordObject, Refer, Tuple } from '@chzky/fp'

export type TupleItem =
  | string
  | number
  | boolean
  | Refer<any>
  | Record<RecordObject>
  | Tuple<TupleItem, number>

/** ## `TupleArray` : 元组类型
@catagory Gymnastics
 */
export type TupleArray<TupleItem, N extends number> = N extends N
  ? number extends N
    ? TupleItem[]
    : TupleOf<TupleItem, N, []>
  : never

type TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : TupleOf<T, N, [T, ...R]>

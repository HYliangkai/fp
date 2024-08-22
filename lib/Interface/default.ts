import { zod, Def, type EmptyObject, type EmptyArr } from '@chzky/fp'
/**  ## Default : 提供一个默认值数据
@example Usage : interface
```ts
const default_data: Default = {
  default: () => 'default data',
}
const data = default_data.default()
assert(data == 'default data')
```
@example Usage : default implement
```ts
const res = match(value,[Default.default(),'jiojio'])
assert(res)
```
@category Interface
 */
export interface Default<T = unknown> {
  default: () => T
}

/** ## `implements_defaul`t : duck type to judge Default type  @category Interface */
export function implements_default(value: unknown): value is Default<unknown> {
  return zod.object({ default: zod.function() }).safeParse(value).success
}

interface DefaultValue extends Default<typeof Def> {
  function: () => void
  number: 0
  string: ''
  object: EmptyObject
  array: EmptyArr
  bigint: bigint
  boolean: boolean
  null: null
  underfind: undefined
  match: <
    T extends
      | 'bigint'
      | 'boolean'
      | 'number'
      | 'string'
      | 'function'
      | 'object'
      | 'array'
      | 'null'
      | 'underfind'
  >(
    inp: T
  ) => T extends 'bigint'
    ? bigint
    : T extends 'boolean'
    ? boolean
    : T extends 'number'
    ? 0
    : T extends 'string'
    ? ''
    : T extends 'function'
    ? () => void
    : T extends 'object'
    ? EmptyObject
    : T extends 'array'
    ? EmptyArr
    : T extends 'null'
    ? null
    : T extends 'underfind'
    ? undefined
    : never
}

/** Default : 基本类型的Default实现 */
export const Default: DefaultValue = {
  default: () => Def,
  function: () => {},
  number: 0,
  string: '',
  object: {},
  array: [],
  bigint: BigInt(0),
  boolean: true,
  null: null,
  underfind: undefined,
  match: <
    T extends
      | 'bigint'
      | 'boolean'
      | 'number'
      | 'string'
      | 'function'
      | 'object'
      | 'array'
      | 'null'
      | 'underfind'
  >(
    inp: T
  ): any => {
    if (inp === 'bigint') return Default['bigint']
    if (inp === 'boolean') return Default['boolean']
    if (inp === 'number') return Default['number']
    if (inp === 'string') return Default['string']
    if (inp === 'function') return Default['function']
    if (inp === 'object') return Default['object']
    if (inp === 'array') return Default['array']
    if (inp === 'null') return Default['null']
    if (inp === 'underfind') return Default['underfind']
    throw new TypeError(`doesn't exist ${String(inp)} in Default`)
  },
} as const

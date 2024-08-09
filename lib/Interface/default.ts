import { zod } from '@chzky/fp'
/**  ## Default : 提供一个默认值数据
@example
```ts
const default_data: Default = {
  default: () => 'default data',
}
const data = default_data.default()
assert(data == 'default data')
```
@category Interface
 */
export interface Default<T = unknown> {
  default: () => T
}

/** ## implements_default : duck type to judge Default type 
@category Interface
  */
export function implements_default(value: unknown): value is Default<unknown> {
  return zod.object({ default: zod.function() }).safeParse(value).success
}

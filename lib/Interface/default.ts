/**  ## Default : Provide default data
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
  return typeof value === 'object' && typeof (value as Default<unknown>)['default'] === 'function'
}

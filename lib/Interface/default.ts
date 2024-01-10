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
export interface Default {
  default: () => unknown
}

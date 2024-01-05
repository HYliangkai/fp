/** ## shallow_copy : 浅拷贝 
使用浅拷贝之后直接使用 === 判断为 true
@example
```ts
  assert(shallow_copy(1) === 1)
  assert(shallow_copy(null) === null)
  assert(shallow_copy(undefined) === undefined)

  const A = {name: 'jiojio'}
  assertFalse(shallow_copy(A) === A, 'Not equald in obj')

  const B = {name: 'jiojio', info: {name: 'dio'}}
  assert(shallow_copy(B).name === B.name)
  assert(shallow_copy(B).info === B.info)
```
@category Function
*/
export function shallow_copy<T>(val: T): T {
  return val === null ? val : typeof val === 'object' ? Object.assign({}, val) : val
}

/** 不推荐在JS中使用深拷贝,因为比较耗费性能,使用 immer.js 能很好的解决数据隔绝问题 */

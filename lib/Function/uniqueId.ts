const id_counter: any = {}
/** ## unique_id : 获取全局唯一id值
@param prefix 前缀, 默认`$chzky$`
@example 
```ts
const id1=unique_id()
const id2=unique_id()
assert(id1=='')
```
@category Function
*/
export const unique_id = (prefix = '$chzky$'): string => {
  if (!id_counter[prefix]) id_counter[prefix] = 0
  const id = ++id_counter[prefix]
  return prefix === '$chzky$' ? `${id}` : `${prefix}${id}`
}

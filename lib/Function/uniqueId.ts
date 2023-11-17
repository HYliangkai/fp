const id_counter: any = {}
/** 通过建立局部变量获取唯一值 */
export const unique_id = (prefix = '$chzky$') => {
  if (!id_counter[prefix]) id_counter[prefix] = 0
  const id = ++id_counter[prefix]
  return prefix === '$chzky$' ? `${id}` : `${prefix}${id}`
}

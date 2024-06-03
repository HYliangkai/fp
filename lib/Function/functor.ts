/** ## Functor : 函数解析器 */

export const Functor = (expression: string): any => {
  let idx = 0
  const args = []
  while (expression.includes('$' + idx)) {
    args.push('$' + idx)
    idx++
  }
  return Function(...args, `return ${expression}`)
}

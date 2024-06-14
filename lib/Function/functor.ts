import { Err, Fns, Ok } from '../../mod.ts'
/** ## Functor : 函数解析器,用于简化函数调用 
- 启发于Swift的闭包简写,可以将函数表达式转换为函数对象,并且可以传入参数 ; 
  将难看的闭包调用转换为简单的字符串表达式,增加代码可读性
@example
```ts
const fn = Functor(`$0+$1`) 
//-> (a,b)=>a+b  <$0表示第一个参数,$1表示第二个参数>
assert(fn(1,2)===3)
```
 */
export const Functor = <T = any>(expression: string): Fns<T> => {
  if (typeof expression !== 'string') throw new TypeError('expression must be a string')
  const max = find_max_idx(expression).unwarp()
  const args = Array.from({ length: max }, (_, i) => `$${i}`)
  //@ts-ignore : 函数调用
  return Function(...args, `return ${expression}`)
}

/** 找出字符串中最大的$idx */
function find_max_idx(expression: string) {
  if (!expression.includes('$')) return Ok(0)
  const matches = expression.match(/\$(\d+)/g)
  if (!matches) return Err(new SyntaxError('expression must be a string like $0+$1'))
  const max = Math.max(...matches.map((match) => Number(match.slice(1))))
  return Ok(max + 1)
}

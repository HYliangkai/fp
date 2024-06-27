import { Err, Fns, Functor_Param_Tag, Ok, Proxy_Value, Result } from '../../mod.ts'
/** ## functor : 函数解析器,用于简化函数调用 
- 启发于Swift的闭包简写,可以将函数表达式转换为函数对象,并且可以传入参数 ; 
  将难看的闭包调用转换为简单的字符串表达式,增加代码可读性
@example
```ts
  // 1. 简单的函数调用
  const Arr = [1, 2, 3, 4]
  const val = 1
  const res = Arr.map(functor<number>`$0+${val}`)
  assertEquals(res, [2, 3, 4, 5])

  // 2. 函数嵌套
  const res1 = pipe(
    1, 
    functor`$0*2`, functor`{name:'jiojio',age:$0}`, functor`{ result: $0 }`
  )
  assertEquals(res1, { result: { name: 'jiojio', age: 2 } })

  // 3. 类型提示
  const user = {
    info: {
      name: 'jiojio',
      age: 18,
      address: {
        before: 'ZXaaa',
        now: 'xxxUAaaa',
      },
    },
  }
  const now_address = pipe(user, functor`${($0 as typeof user).info.address.now}`)
  assertEquals(now_address, 'xxxUAaaa')  
```
 */

export const functor = <T = unknown>(strings: TemplateStringsArray, ...args: any[]): Fns<T> =>
  Functor(args.reduce((prev, cur, i) => prev + parse_param(cur) + strings[i + 1], strings[0]))

function parse_param(param: any): string {
  if (typeof param == 'string') return param
  if (typeof param === 'object' && param[Functor_Param_Tag] === true) return param[Proxy_Value]
  throw new TypeError('param must be a string or funtor params ')
}

function Functor(expression: string): any {
  if (typeof expression !== 'string') throw new TypeError('expression must be a string')
  const max = find_max_idx(expression).unwarp()
  const args = Array.from({ length: max }, (_, i) => `$${i}`)
  return Function(...args, `return ${expression}`)
}

/** 找出字符串中最大的$idx */
function find_max_idx(expression: string): Result<number, SyntaxError> {
  if (!expression.includes('$')) return Ok(0)
  const matches = expression.match(/\$(\d+)/g)
  if (!matches) return Err(new SyntaxError('expression must be a string like $0+$1'))
  const max = Math.max(...matches.map((match) => Number(match.slice(1))))
  return Ok(max + 1)
}

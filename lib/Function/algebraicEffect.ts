import {Err, Ok, Result, is_result} from '../../mod.ts'

const weak_states: WeakMap<Function, 'pending' | 'fulfulled' | 'error'> = new WeakMap()
const weak_datas: WeakMap<Function, any> = new WeakMap()

function is_promise(pro: Promise<any> | null): pro is Promise<any> {
  return (
    pro !== null &&
    (typeof pro === 'object' || typeof pro === 'function') &&
    typeof pro.then === 'function'
  )
}

/** 
## wait : Convert asynchronous functions into synchronous execution
模拟[代数效应](https://mongkii.com/blog/2021-05-08-talk-about-algebraic-effects)在JS引擎的实现.

配合`run_effect`函数能实现 将异步代码转化为同步执行 的效果

example
```typescript
const func1 = async () => {//mock async incident
  const pro1: string = await new Promise(res => {
    setTimeout(() => { res('Yes')}, 3000)  })
  return pro1
}

async function func1(){
  const pro2: string = await new Promise(res =>
    setTimeout(() => {res('No') }, 2000)  ) 
  return pro2
}

const running=()=>{
  const A=wait(func1)
  console.log(A.unwarp()) // 'Yes'
  const B=wait(func2)
  console.log(B.unwarp())//'No'
  return A.unwarp()+B.unwarp()
}

run_effect(running,(res)=>{
  console.log(res.unwarp())//'YesNo'
})
```
### 注意事项⚠️
+  除了`wait()`内的函数,`run_effect()`内执行过程必须是[**纯函数**](https://zh.wikipedia.org/zh-hant/%E7%BA%AF%E5%87%BD%E6%95%B0)
+ `wait()`需要包裹在`run_effect()`内执行,`run_effect()`对于外部来说是一个异步函数,后续操作要在回调中执行
+ `wait(fn)`传入的fn不能是个匿名函数,必须是个具名函数,否则会报错
+ `wait()`语句尽量放在执行过程前面,能提高执行效率(由于JS并不支持代数效应导致)
 */
export const wait = <T, E = unknown>(fn: () => Promise<T>): Result<T, E> => {
  const state = weak_states.get(fn)
  if (fn.name && fn.name != 'anonymous') {
    if (state === undefined) {
      weak_states.set(fn, 'pending')
      weak_datas.set(fn, null)
    }
  } else {
    throw Error('wait() 不能传递匿名函数 !!')
  }
  if (state === 'fulfulled') return Ok(weak_datas.get(fn))
  else if (state === 'error') return Err(weak_datas.get(fn))

  //第一次执行才会执行这一步
  throw fn().then(
    res => {
      weak_states.set(fn, 'fulfulled')
      weak_datas.set(fn, res)
    },
    err => {
      weak_states.set(fn, 'error')
      weak_datas.set(fn, err)
    }
  )
}
/** 运行环境 */
export function run_effect<T extends Result<any, any>>(
  fn: () => T,
  callback?: (res: T) => any
): void
export function run_effect<T, E = unknown>(fn: () => T, callback?: (res: Result<T, E>) => any): void
export function run_effect(fn: () => any, callback?: (res: any) => any): void {
  try {
    const res = fn()
    {
      callback ? (is_result(res) ? callback(res) : callback(Ok(res))) : ''
    }
  } catch (effect) {
    if (is_promise(effect)) {
      effect.then(
        () => {
          run_effect(fn, callback)
        },
        () => {
          run_effect(fn, callback)
        }
      )
    } else {
      callback ? callback(Err(effect)) : ''
    }
  }
}

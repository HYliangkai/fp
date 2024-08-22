import { AnyError, if_then, pipe, produce, State, UnexpectedError } from '@chzky/fp'
import { assert, assertEquals } from '@std/assert/mod.ts'

Deno.test('State-base', () => {
  const main = true
  const sub = { name: 'jiojio', age: 18 }
  const s1 = State(main, sub)

  assert(s1.unwrap())
  assertEquals(s1.effect().age, 18)

  assert(!s1.map((v) => !v).unwrap())
  assert(s1.rep(true).effect())
  assert(s1.chain(([m, s]) => [!m, { ...s, age: 20 }]).effect().age === 20)
  assert(s1.ap(() => true).effect())
})

Deno.test('State-case', () => {
  const man = true
  const info = { name: 'jiojio', age: 18 }
  type INFO = typeof info
  type IS_MAN = boolean

  // Usage1 : 用于简化多参数函数的调用
  function main(info: INFO, is_man: boolean) {
    if_then(is_man, () => {
      assertEquals(info, { name: 'jiojio', age: 18 })
    })
  }
  //在main函数中,不变的是info信息,而is_man是变化的,所以可以使用State-effect来存储is_man的状态
  function main_change(State: State<INFO, IS_MAN>) {
    if_then(State.effect(), () => {
      assertEquals(State.unwrap(), info)
    })
  }
  /** **Usage2**  配合`pipe`函数存储过程数据  :  
  pipe函数虽然让函数调用变得十分优雅,但是有一个问题就是只能返回一个值,但是有时候我们需要返回多个值(譬如不想多次计算的计算结果,这些数据属于状态数据,对于结果没有影响但是为了提高效率要用得到),这时候就可以使用State将主要数数据和副作用数据进分隔开
   */
  function step1(info: INFO) {
    info.age += 1
    const comput_freq = 1
    return State(info, comput_freq)
  }

  function step2(State: State<INFO, number>) {
    if_then(State.unwrap().name == 'jiojio', () => {
      main_change(State.rep(true))
    }).unwrap()

    /** 更新数据,进行数据隔离 */
    const as2 = State.draft((draft) => {
      //要更新数据必须先取出value值,然后进行操作
      draft[0].age += 1
      draft[1] = 2
    })

    /* 旧数据 <age> */
    assert(State.unwrap().age === 19)
    /** 新数据 <{age:20},2>  */
    assert(as2.unwrap().unwrap().age === 20)
    assert(as2.unwrap().effect() === 2)
  }

  pipe(info, step1, step2)
})

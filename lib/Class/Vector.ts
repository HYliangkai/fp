import {Err, Ok, Some, None, Debug, Copy} from '../../mod.ts'

type CallBack<T, R = void> = (value: T, index: number) => R

type ITR<T = any> = Iterator<T>

type ITB<T = any> = Iterable<T>

/** ## Vector :  一个惰性求值的迭代器封装 , 操作具有迭代器的一次性性质 */
export class Vector<T> implements Debug, Copy {
  private generator: ITR<unknown>
  constructor(iter: ITB<T> | ITR<T>, itable = true) {
    this.generator = itable ? (iter as ITB<T>)[Symbol.iterator]() : (iter as ITR<T>)
  }

  ////////////////////////////////////////
  //////                            //////
  //////            consume          //////
  //////                            //////
  ////////////////////////////////////////

  /** ### `consume` max : 获取最大值*/
  max(): Result<number, 'NaN'> {
    const i = Math.max(...(this.generator as any))
    return isNaN(i) ? Err('NaN') : Ok(i)
  }

  /** ### `consume` min : 获取最小值  */
  min(): Result<number, 'NaN'> {
    const i = Math.min(...(this.generator as any))
    return isNaN(i) ? Err('NaN') : Ok(i)
  }

  /** ### `consume` take : 将数据转化成array并获取rang二哥 */
  take(range = Infinity) {
    return take(this.generator, range) as T[]
  }

  /** ### `consume` position */
  position(call: CallBack<T, boolean>) {
    return position(this.generator, call) as Option<number>
  }

  /** ### `consume` find */
  find(call: CallBack<T, boolean>) {
    return find(this.generator, call) as Option<T>
  }

  ////////////////////////////////////////
  //////                            //////
  //////            nolazy          //////
  //////                            //////
  ////////////////////////////////////////

  /** ### `nolazy` clone : 复制迭代器内容(浅拷贝) */
  clone(): this {
    const this_gen: T[] = []
    const retrun_gen: T[] = []
    while (true) {
      const r = this.generator.next()
      if (r.done) break
      this_gen.push(r.value as T)
      retrun_gen.push(r.value as T)
    }
    this.generator = this_gen[Symbol.iterator]()
    return new Vector(retrun_gen) as this
  }

  /** ### `nolazy` log : 打印数据  */
  log() {
    const this_gen: T[] = []
    while (true) {
      const r = this.generator.next()
      if (r.done) break
      this_gen.push(r.value as T)
    }
    console.log(this_gen)
    this.generator = this_gen[Symbol.iterator]()
  }

  ////////////////////////////////////////
  //////                            //////
  //////            iterator        //////
  //////                            //////
  ////////////////////////////////////////

  /** ### zip : 将两个迭代器合并为一个,超出部分将舍弃 */
  zip<O>(other: ITB<O>): Vector<[T, O]> {
    this.generator = zip(this.generator, other[Symbol.iterator]())
    return this as Vector<[T, O]>
  }

  /** ### push : 迭代器Push数据 */
  push<O>(item: O) {
    this.generator = push(this.generator, item)
    return this as Vector<T | O>
  }

  /** ### pop : 迭代器Pop数据 */
  pop() {
    this.generator = pop(this.generator)
    return this as Vector<T>
  }

  /** ### shift : 迭代器Shift数据 */
  shift() {
    this.generator = shift(this.generator)
    return this as Vector<T>
  }

  /** ### unshift : 迭代器Unshift数据  */
  unshift<O>(item: O) {
    this.generator = unshift(this.generator, item)
    return this as Vector<T | O>
  }

  /** ### filter : [迭代器filter数据](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) */
  filter<O = T>(call: CallBack<T, boolean>) {
    this.generator = filter(this.generator, call)
    return this as Vector<any> as Vector<O>
  }

  /** ### map */
  map<O>(call: CallBack<T, O>) {
    this.generator = map(this.generator as ITR<T>, call) as ITR<O>
    return this as Vector<any> as Vector<O>
  }

  static new<T>(...iter: T[] | [ITB<T>]): Vector<T> {
    if (iter.length > 1) return new Vector(iter as T[])
    return new Vector(
      (iter[0] as any)[Symbol.iterator] !== undefined ? (iter[0] as ITB<T>) : (iter as [T])
    )
  }

  [Symbol.iterator]() {
    return this.generator as ITR<T>
  }
}

/** ## The Function of Init {@link Vector}
Example:
1. use Iterable 
```ts
const vec : Vector<number> = Vector.new(1, 2, 3, 4)
```
2. use any params
```ts
const vec : Vector<number> = Vector.new(1, 2, 3, 4)
```
 */
export const vec = Vector.new

/* Consume Generator  */

function log_iterator(t: ITR) {
  while (true) {
    const r = t.next()
    if (r.done) break
    console.log(r.value)
  }
}

function take(t: ITR, number: number) {
  let idx = 0
  const res = []
  while (number > idx) {
    const r = t.next()
    if (r.done) break
    res.push(r.value)
    idx++
  }
  return res
}

function position<O>(t: ITR, call: CallBack<O, boolean>) {
  let idx = 0
  while (true) {
    const r = t.next()
    if (r.done) break
    if (call(r.value, idx)) return Some(idx)
    idx++
  }
  return None
}

function find<O>(t: ITR, call: CallBack<O, boolean>) {
  let idx = 0
  while (true) {
    const r = t.next()
    if (r.done) break
    if (call(r.value, idx)) return Some(r.value)
    idx++
  }
  return None
}

/* Generator Creater */
function* zip<L, R>(l: ITR<L>, r: ITR<R>) {
  let left = l.next()
  let right = r.next()
  while (!left.done && !right.done) {
    yield [left.value, right.value]
    left = l.next()
    right = r.next()
  }
}

function* push<O>(t: ITR, val: O) {
  while (true) {
    const r = t.next()
    if (r.done) break
    yield r.value
  }
  yield val
}

function* unshift<O>(t: ITR, val: O) {
  yield val
  while (true) {
    const r = t.next()
    if (r.done) break
    yield r.value
  }
}

function* pop(t: ITR) {
  let peek = t.next()
  while (true) {
    const r = t.next()
    if (r.done) break
    yield peek.value
    peek = r
  }
}

function* shift(t: ITR) {
  t.next()
  while (true) {
    const r = t.next()
    if (r.done) break
    yield r.value
  }
}

function* filter<O>(t: ITR, call: CallBack<O, boolean>) {
  let idx = 0
  while (true) {
    const r = t.next()
    if (r.done) break
    if (call(r.value, idx)) yield r.value
    idx++
  }
}

function* map<L, R>(t: ITR<L>, call: CallBack<L, R>) {
  let idx = 0
  while (true) {
    const r = t.next()
    if (r.done) break
    yield call(r.value, idx)
    idx++
  }
}

/* other function */
function is_iterator<T>(val: unknown): val is ITB<T> {
  return (val as any)[Symbol.iterator] !== undefined
}

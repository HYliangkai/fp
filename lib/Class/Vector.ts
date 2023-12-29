/** ## Vector : 一个惰性求值的迭代器的封装
 */
import {Err, Ok, Result, Some, None, Option} from '../../mod.ts'

/*
+ zip()
+ max()
+ min()
+ take()
+ to_push()
+ to_pop()
+ to_shift()
+ to_unshift()
+ position()
+ rposition()
*/

type OnlyType<T, V> = T extends V ? T : never
type LoopCallBack<T, R = void> = (value: T, index: number) => R
type Narrow<R> = (value: unknown, index: number) => value is R
type ITR<T = any> = Iterator<T>
type ITB<T = any> = Iterable<T>

export class Vector<T> {
  private generator: ITR<unknown>
  constructor(iter: ITB<T> | ITR<T>, itable = true) {
    this.generator = itable ? (iter as ITB<T>)[Symbol.iterator]() : (iter as ITR<T>)
  }

  /** ### `consume` log : 打印数据  */
  log() {
    log_iterator(this.generator)
  }

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

  /** ### `consume` take : 将数据转化成array */
  take(range = Infinity) {
    return take(this.generator, range) as T[]
  }

  /** ### zip : 将两个迭代器合并为一个,超出部分将舍弃 */
  zip<O>(other: ITB<O>) {
    this.generator = zip(this.generator, other[Symbol.iterator]())
    return this as Vector<[T, O]>
  }

  /** ### push */
  push<O>(item: O) {
    this.generator = push(this.generator, item)
    return this as Vector<T | O>
  }

  /** ### pop */
  pop() {
    this.generator = pop(this.generator)
    return this as Vector<T>
  }

  /** ### shift */
  shift() {
    this.generator = shift(this.generator)
    return this as Vector<T>
  }

  /** ### unshift */
  unshift<O>(item: O) {
    this.generator = unshift(this.generator, item)
    return this as Vector<T | O>
  }

  /** ### `consume` position */
  position(call: LoopCallBack<T, boolean>) {
    return position(this.generator, call) as Option<number>
  }

  /** ### `consume` find */
  find(call: LoopCallBack<T, boolean>) {
    return find(this.generator, call) as Option<T>
  }

  /** ### filter */
  filter<O = T>(call: LoopCallBack<T, boolean>) {
    this.generator = filter(this.generator, call)
    return this as Vector<any> as Vector<O>
  }

  /** ### map */
  map<O>(call: LoopCallBack<T, O>) {
    this.generator = map(this.generator as ITR<T>, call) as ITR<O>
    return this as Vector<any> as Vector<O>
  }

  static new<T>(...iter: T[] | [ITB<T>]) {
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

function position<O>(t: ITR, call: LoopCallBack<O, boolean>) {
  let idx = 0
  while (true) {
    const r = t.next()
    if (r.done) break
    if (call(r.value, idx)) return Some(idx)
    idx++
  }
  return None
}

function find<O>(t: ITR, call: LoopCallBack<O, boolean>) {
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

function* filter<O>(t: ITR, call: LoopCallBack<O, boolean>) {
  let idx = 0
  while (true) {
    const r = t.next()
    if (r.done) break
    if (call(r.value, idx)) yield r.value
    idx++
  }
}

function* map<L, R>(t: ITR<L>, call: LoopCallBack<L, R>) {
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

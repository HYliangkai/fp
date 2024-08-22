import {
  type Option,
  type Vector,
  type Fn,
  type Result,
  type OrdSelf,
  type OrdResult,
  type AnyResult,
  type NonZeroPositiveInteger,
  Ok,
  Err,
  Some,
  None,
  option,
  result,
  Peekable,
  VectorSize,
  VectorState,
  NotSupportError,
} from '@chzky/fp'
import {
  chain,
  copy,
  cycle,
  drop,
  take,
  unzip,
  join,
  last,
  map,
  min,
  nth,
  max,
  min_by,
  max_by,
  filter,
  reduce,
  as_array,
  inspect,
  step_by,
  position,
  partition,
  filter_map,
  size_check,
  state_check,
  intersperse,
  init_from_iter,
  type VertorUsedError,
  type VectorInfiniteLengthError,
  zip,
  find,
  sum,
  stream,
  each,
} from './core.ts'

class vector<T> implements Vector<T> {
  state: VectorState
  size: VectorSize
  gen: Generator<T>

  private range: [number, Option<number>]

  constructor(gen: Generator<T>, size: VectorSize, range: [number, Option<number>]) {
    this.state = VectorState.PEND
    this.size = size
    this.gen = gen
    this.range = range
  }

  /** @Pend */

  map<R>(cb: Fn<T, R>): Vector<R> {
    this.gen = map(this.gen, cb) as any
    return this as unknown as Vector<R>
  }

  filter(cb: Fn<T, boolean>): Vector<T> {
    this.gen = filter(this.gen, cb) as any
    return this as unknown as Vector<T>
  }

  filter_map<R>(cb: Fn<T, Option<R>>): Vector<R> {
    this.gen = filter_map(this.gen, cb) as any
    return this as unknown as Vector<R>
  }

  inspect(cb: Fn<T, unknown>): Vector<T> {
    this.gen = inspect(this.gen, cb)
    return this
  }

  drop<N extends number>(num: NonZeroPositiveInteger<N>): Vector<T> {
    this.gen = drop(this.gen, num)
    this.range = [Math.max(this.range[0] - num, 0), this.range[1].map((n) => Math.max(n - num, 0))]
    return this
  }

  take<N extends number>(num: NonZeroPositiveInteger<N>): Vector<T> {
    this.size = VectorSize.LIMITED
    this.range = [0, Some(num)]
    this.gen = take(this.gen, num)
    return this
  }

  step_by<I extends number>(step: NonZeroPositiveInteger<I>): Vector<T> {
    this.range = [
      Math.max(Math.floor(this.range[0] / step), 0),
      this.range[1].map((n) => Math.max(Math.floor(n / step), 0)),
    ]
    this.gen = step_by(this.gen, step)
    return this
  }

  chain<R>(other: Vector<R>): Vector<T | R> {
    const od = other.clone()

    const [min, max] = od.size_hint()
    if (od.size === VectorSize.INFINITY || this.size === VectorSize.INFINITY) {
      this.size = VectorSize.INFINITY
      this.range = [this.range[0] + min, None]
    } else {
      this.range = [this.range[0] + min, this.range[1].map((i) => i + max.unwrap())]
    }

    this.gen = chain(this.gen, od[Symbol.iterator]()) as any
    return this as unknown as Vector<T | R>
  }

  zip<R>(other: Vector<R>): Vector<[T, R]> {
    const od = other.clone()

    const [min, max] = od.size_hint()
    if (od.size === VectorSize.LIMITED || this.size === VectorSize.LIMITED) {
      this.size = VectorSize.LIMITED
      this.range = [
        Math.min(min, this.range[0]),
        Some(
          od.size === VectorSize.LIMITED && this.size === VectorSize.LIMITED
            ? Math.min(max.unwrap(), this.range[1].unwrap())
            : max.unwrap_or(this.range[1].unwrap())
        ),
      ]
    } else {
      this.range = [Math.min(min, this.range[0]), None]
    }

    this.gen = zip(this.gen, od[Symbol.iterator]()) as any
    return this as unknown as Vector<[T, R]>
  }

  cycle(): Vector<T> {
    this.range = [Infinity, None]
    if (this.size === VectorSize.INFINITY) return this
    this.size = VectorSize.INFINITY
    this.gen = cycle(this.gen)
    return this
  }

  intersperse<R>(separator: R): Vector<T | R> {
    this.range = [this.range[0] * 2, this.range[1].map((i) => i * 2)]
    this.gen = intersperse(this.gen, separator) as any
    return this as unknown as Vector<T | R>
  }

  size_hint(): [number, Option<number>] {
    return this.range
  }

  nth(n: number): Option<T> {
    state_check(this.state)
    if (this.range[0] < n) return None
    return option(nth(this.clone()[Symbol.iterator](), n))
  }

  /** @Done */

  collect(): Array<T> {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return as_array(this.gen)
  }

  try_collect(): AnyResult<Array<T>> {
    try {
      return Ok(this.collect())
    } catch (e) {
      return Err(e)
    }
  }

  collect_into<R>(target: Array<R>): Array<R | T> {
    return (this.collect() as Array<R | T>).concat(target)
  }

  reduce<R>(cb: (acc: R | T, cur: T) => R | T, init: R | T): R | T {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return reduce(this.gen, cb, init)
  }

  unzip(): T extends [infer A, infer B] ? [Vector<A>, Vector<B>] : never {
    this.state = VectorState.DONE
    const [g1, g2] = unzip(this.gen)
    return [
      new vector(g1 as any, this.size, this.range),
      new vector(g2 as any, this.size, this.range),
    ] as unknown as T extends [infer A, infer B] ? [Vector<A>, Vector<B>] : never
  }

  join(separator: string): Result<string, VectorInfiniteLengthError | VertorUsedError> {
    return result(() => {
      state_check(this.state)
      size_check(this.size)
      this.state = VectorState.DONE
      return join(this.gen, separator)
    })
  }

  next_chunk(): Option<T> {
    const { value, done } = this.gen.next()
    if (done) {
      this.state = VectorState.DONE
      return None
    }
    this.range = [this.range[0] - 1, this.range[1].map((i) => i - 1)]
    return option(value)
  }

  partition(cb: Fn<T, boolean>): [Array<T>, Array<T>] {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return partition(this.gen, cb)
  }

  position(predicate: T): Option<number> {
    state_check(this.state)
    this.state = VectorState.DONE
    const idx = position(this.gen, predicate)
    return idx === -1 ? None : Some(idx)
  }

  last(): Option<T> {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return option(last(this.gen))
  }

  min(): T extends OrdSelf<T> ? T : never {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return min(this.gen) as unknown as T extends OrdSelf<T> ? T : never
  }

  min_by(cb: (now: T, min: T) => OrdResult): T {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return min_by(this.gen, cb)
  }

  max(): T extends OrdSelf<T> ? T : never {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return max(this.gen) as unknown as T extends OrdSelf<T> ? T : never
  }

  max_by(cb: (now: T, min: T) => OrdResult): T {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return max_by(this.gen, cb)
  }

  find(cb: Fn<T, boolean>): Option<T> {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return option(find(this.gen, cb))
  }

  every(cb: Fn<T, boolean>): boolean {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return as_array(this.gen).every(cb)
  }

  some(cb: Fn<T, boolean>): boolean {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return as_array(this.gen).some(cb)
  }

  sum(): T extends number ? T : never {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return sum(this.gen as unknown as Generator<number>) as unknown as T extends number ? T : never
  }

  count(): number {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    return this.as('array').length
  }

  add_generator<R>(gencb: Fn<Generator<T, any, unknown>, Generator<R, any, unknown>>): Vector<R> {
    this.gen = gencb(this.gen) as any
    return this as unknown as Vector<R>
  }

  each(cb: Fn<T, unknown>): void {
    state_check(this.state)
    size_check(this.size)
    this.state = VectorState.DONE
    each(this.gen, cb)
  }

  stream(cb: (item: T, next: Fn<void, void>) => unknown): Promise<void> {
    state_check(this.state)
    this.state = VectorState.DONE
    return stream(this.gen, cb)
  }

  /** @Impl */

  as(flag: 'array'): Array<T> {
    if (flag !== 'array') throw NotSupportError.new('Unable to convert to a non-Array type')
    size_check(this.size)
    this.state = VectorState.DONE
    return as_array(this.gen)
  }

  clone(): Vector<T> {
    const [g1, g2] = copy(this.gen)
    this.gen = g1
    return new vector(g2, this.size, this.range)
  }

  into(flag: 'peek'): Peekable<T, Iterator<T, any, undefined>> {
    if (flag !== 'peek') throw NotSupportError.new('Unable to convert to a non-Peekable type')
    state_check(this.state)
    this.state = VectorState.DONE
    return new Peekable(this.gen)
  }

  static from<T>(val: Array<T>): Vector<T> {
    return new vector(init_from_iter(val), VectorSize.LIMITED, [val.length, Some(val.length)])
  }

  [Symbol.iterator](): Generator<T> {
    return this.gen
  }
}

/** ## `Vec`  : 创建一个{@link Vector}
@param from 从一个数组或者生成器创建
@example Usage : 从数组生成
```ts
  const name_r = ['jio', 'jiojio', 'dio', 'diojio']
  const address = ['防抖华云', '公园花园', '秀琼花园']
  const arr = Array.from({ length: 100000 }, (_, i) => ({
    name: name_r[i % name_r.length],
    id: i,
    address: address[i % address.length],
    is: false,
  }))

  // 取 name ==='jiojio' && address==='公园花园' 的数据并进行分页处理
  const res = Vec(arr)
    .filter((i) => i.name === 'jiojio')
    .filter((i) => i.address === '公园花园')
    .drop(500)
    .take(15)
    .collect()
```
@example Usage : 从生成器生成
```ts
  //创建无限长度
  const gen = (function* () {
    let idx = 0
    while (true) {
      yield idx++
    }
  })()
  const res = Vec(gen)
    .map((i) => `number-is-${i}`)
    .take(100)
    .collect()

  assert(res.length === 100)

  //创建有限长度
  const seq = assert_sequence()
  Vec(number_generator(1, 10), true).each(seq) // Pass

```

@category Class
*/
export function Vec<T>(from: Array<T>): Vector<T>
export function Vec<T>(from: Generator<T>, finite?: boolean): Vector<T>
export function Vec(from: any, infinite = false): any {
  if (Array.isArray(from)) return vector.from(from)
  if (typeof from === 'object' && from.toString() === '[object Generator]')
    return new vector(from, infinite ? VectorSize.LIMITED : VectorSize.INFINITY, [0, None])
  throw NotSupportError.new('no support to create Vector from this type')
}

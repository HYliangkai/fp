import {
  AnyError,
  implements_ord,
  OrdResult,
  VectorSize,
  VectorState,
  type Fn,
  type Ord,
  type Option,
} from '@chzky/fp'

/** ## `VertorUsedError` : Vertor已经被使用,不能再次被消费 */
export class VertorUsedError extends AnyError<'Error'> {
  constructor(cause = 'Vector is already used') {
    super('Error', cause, 'VertorUsedError')
  }
}

/** ## `VectorInfiniteLengthError` : Vector的长度为无限,无法生成有限长度的数据结构 */
export class VectorInfiniteLengthError extends AnyError<'Error'> {
  constructor(cause = 'Vector is infinite length') {
    super('Error', cause, 'VectorInfiniteLengthError')
  }

  new(): VectorInfiniteLengthError {
    return new VectorInfiniteLengthError('Vector is infinite length')
  }
}

export function state_check(state: VectorState): void | never {
  if (state === VectorState.DONE) throw VertorUsedError.new()
}

export function size_check(state: VectorSize): void | never {
  if (state === VectorSize.INFINITY) throw VectorInfiniteLengthError.new()
}

export enum VECERROR {
  NO_CHANGE_SUPPORT = '无法转化成非Array类型',
  NO_CHNAGE_INFINITY = '无限长度的Vector无法转化成Array',
  UNZIP_TYPE_ERROR = 'unzip只对长度为二的元组数组有效',
}

export function* init_from_iter<T>(iter: Iterable<T>): Generator<T> {
  for (const i of iter) {
    yield i
  }
}

export function as_array<T>(gen: Generator<T>): Array<T> {
  return Array.from(gen)
}

export function* map<T, R>(gen: Generator<T>, cb: Fn<T, R>): Generator<R> {
  for (const i of gen) {
    yield cb(i)
  }
}

export function* filter<T>(gen: Generator<T>, cb: Fn<T, boolean>): Generator<T> {
  for (const i of gen) {
    if (cb(i)) yield i
  }
}

export function* filter_map<T, R>(gen: Generator<T>, cb: Fn<T, Option<R>>): Generator<R> {
  for (const i of gen) {
    const res = cb(i)
    if (res.is_some) yield res.unwrap()
  }
}

export function* inspect<T>(gen: Generator<T>, cb: Fn<T, unknown>): Generator<T> {
  for (const i of gen) {
    cb(i)
    yield i
  }
}

export function copy<T>(gen: Generator<T>): [Generator<T>, Generator<T>] {
  const queue: T[] = []
  const idxs: [number, number] = [0, 0]

  function* genc(idx: number): Generator<T> {
    while (true) {
      if (queue.length > idxs[idx]) yield queue[idxs[idx]]
      else {
        const { done, value } = gen.next()
        if (done) return
        queue.push(value)
        yield value
      }
      idxs[idx]++
    }
  }
  return [genc(0), genc(1)]
}

export function* drop<T>(gen: Generator<T>, num: number): Generator<T> {
  let idx = 0
  for (const item of gen) {
    idx++
    if (idx <= num) continue
    yield item
  }
  return
}

export function* take<T>(gen: Generator<T>, num: number): Generator<T> {
  let idx = 0
  for (const item of gen) {
    if (idx >= num) return
    yield item
    idx++
  }
}

export function* step_by<T>(gen: Generator<T>, num: number): Generator<T> {
  let idx = 0
  for (const item of gen) {
    if (idx % num === 0) yield item
    idx++
  }
  return
}

export function* chain<T, R>(g1: Generator<T>, g2: Generator<R>): Generator<T | R> {
  for (const item1 of g1) {
    yield item1
  }
  for (const item2 of g2) {
    yield item2
  }
}

export function* zip<T, R>(g1: Generator<T>, g2: Generator<R>): Generator<[T, R]> {
  while (true) {
    const { value: v1, done: d1 } = g1.next()
    const { value: v2, done: d2 } = g2.next()
    if (d1 || d2) return
    yield [v1, v2]
  }
}

export function unzip<T>(
  gen: Generator<T>
): Generator<T extends [infer A, infer B] ? [Generator<A>, Generator<B>] : never> {
  const queue: Array<[T, T]> = []
  const idxs = [0, 0]

  function* gc(idx: number): Generator<any> {
    while (true) {
      if (queue.length > idxs[idx]) yield queue[idxs[idx]][idx]
      else {
        const { done, value } = gen.next()
        if (done) return
        if (!Array.isArray(value) || value.length !== 2) throw TypeError(VECERROR.UNZIP_TYPE_ERROR)
        queue.push(value as [T, T])
        yield value[idx]
      }
      idxs[idx]++
    }
  }

  return [gc(0), gc(1)] as any
}

export function* cycle<T>(gen: Generator<T>): Generator<T> {
  const queue: T[] = []
  let idx = 0

  for (const item of gen) {
    queue.push(item)
    yield item
    idx++
  }

  while (true) {
    idx = (idx + 1) % queue.length
    yield queue[idx]
  }
}

export function* intersperse<T, R>(gen: Generator<T>, separator: R): Generator<T | R> {
  for (const item of gen) {
    yield item
    yield separator
  }
}

export function reduce<T, R>(
  gen: Generator<T>,
  cb: (acc: R | T, cur: T) => R | T,
  init: R | T
): R | T {
  let ini = init
  for (const item of gen) {
    ini = cb(ini, item)
  }
  return ini
}

export function join(gen: Generator, separator: string): string {
  let res = ''
  for (const item of gen) {
    res += item + separator
  }
  return res
}

export function nth<T>(gen: Generator<T>, n: number): T | null {
  let idx = 0
  for (const item of gen) {
    if (idx === n) return item
    idx++
  }
  return null
}

export function partition<T>(gen: Generator<T>, cb: Fn<T, boolean>): [Array<T>, Array<T>] {
  const res: [Array<T>, Array<T>] = [[], []]
  for (const item of gen) {
    if (cb(item)) res[0].push(item)
    else res[1].push(item)
  }
  return res
}

export function position<T>(gen: Generator<T>, target: T): number {
  let idx = -1
  let tdx = 0
  for (const item of gen) {
    if (item === target) {
      idx = tdx
      break
    }
    tdx++
  }
  return idx
}

export function last<T>(gen: Generator<T>): T | null {
  let res = null
  for (const item of gen) {
    res = item
  }
  return res
}

export function min<T extends Ord<unknown>>(gen: Generator<any>): T {
  const { value, done } = gen.next()
  if (!implements_ord(value)) throw new TypeError('T must implement Ord')
  if (done) return value as T
  let min = value as Ord<T>
  for (const item of gen) {
    /* item < min */
    if (item.compare(min) === OrdResult.LT) min = item as Ord<unknown>
  }
  return min as T
}

export function min_by<T>(gen: Generator<T>, cb: (now: T, min: T) => OrdResult): T {
  const { value, done } = gen.next()
  if (done) return value as T
  let min = value as T
  for (const item of gen) {
    if (cb(item, min) === OrdResult.LT) min = item
  }
  return min
}

export function max<T extends Ord<unknown>>(gen: Generator<any>): T {
  const { value, done } = gen.next()
  if (!implements_ord(value)) throw new TypeError('T must implement Ord')
  if (done) return value as T
  let min = value as Ord<T>
  for (const item of gen) {
    /* item < min */
    if (item.compare(min) === OrdResult.GT) min = item as Ord<unknown>
  }
  return min as T
}

export function max_by<T>(gen: Generator<T>, cb: (now: T, min: T) => OrdResult): T {
  const { value, done } = gen.next()
  if (done) return value as T
  let min = value as T
  for (const item of gen) {
    if (cb(item, min) === OrdResult.GT) min = item
  }
  return min
}

export function find<T>(gen: Generator<T>, cb: Fn<T, boolean>): T | null {
  for (const item of gen) {
    if (cb(item)) return item
  }
  return null
}

export function some<T>(gen: Generator<T>, cb: Fn<T, boolean>): boolean {
  for (const item of gen) {
    if (cb(item)) return true
  }
  return false
}

export function every<T>(gen: Generator<T>, cb: Fn<T, boolean>): boolean {
  for (const item of gen) {
    if (!cb(item)) return false
  }
  return true
}

export function sum(gen: Generator<number>): number {
  let sum = 0
  for (const item of gen) {
    sum += item
  }
  return sum
}

export async function stream<T>(
  gen: Generator<T>,
  cb: (item: T, next: Fn<void, void>) => unknown
): Promise<void> {
  const { value, done } = gen.next()
  if (done) return
  let nval = value
  let RETURN = false
  while (true) {
    if (RETURN) return
    const { resolve, promise } = Promise.withResolvers()
    const dcb = () => {
      const { value, done } = gen.next()
      if (done) RETURN = true
      else nval = value
      resolve(void 0)
    }
    cb(nval, dcb)
    await promise
  }
}

export function each<T>(gen: Generator<T>, cb: Fn<T, unknown>): void {
  for (const item of gen) {
    cb(item)
  }
}

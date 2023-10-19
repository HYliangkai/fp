/** 可中断的foreach */
type IterableType<T> = {
  [Symbol.iterator](): Iterator<T>
}
const sym = Symbol('f-e-s')
const block = () => {
  throw sym
}
export const for_each = <T>(
  AL: IterableType<T>,
  callback: (item: T, index: number, block: () => never) => any
) => {
  try {
    let index = 0
    for (const item of AL) {
      callback(item, index, block)
      index++
    }
  } catch (err) {
    if (err !== sym) throw err
  }
}

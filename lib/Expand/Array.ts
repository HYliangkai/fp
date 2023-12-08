import {None, Option, Some} from '../mod.ts'

declare global {
  interface Array<T> {
    /** ### zip :  zip two array
    example:
    ```ts
    const A=[1,2,3]
    const B=[4,5,6]
    A.zip(B) // => [[1,2,3],[4,5,6]]
    ```
     */
    zip<V>(arr: Array<V>): [Array<T>, Array<V>]
    max(): T extends number ? number : never
    min(): T extends number ? number : never
    for_each(callback: (item: T, index: number, block: () => void) => any): void
    to_push(value: T): Array<T>
    to_pop(value: T): Array<T>
    to_shift(value: T): Array<T>
    to_unshift(value: T): Array<T>
    /** findIdex with Option */
    position(callback: (item: T, index: number) => boolean): Option<number>
    /** findLastIndex with Option */
    rposition(callback: (item: T, index: number) => boolean): Option<number>
  }

  interface ArrayConstructor {
    /** Array default is `[ ]` */
    default(): Array<void>
  }
}

Array.prototype.zip = function <T>(arr: Array<T>) {
  return [this, arr]
}

Array.prototype.max = function () {
  return Math.max(...this)
}
Array.prototype.min = function () {
  return Math.min(...this)
}
Array.prototype.for_each = function (callback) {
  let flag = false
  const block = () => {
    flag = true
  }
  for (let i = 0; i < this.length; i++) {
    if (flag) {
      flag = false
      break
    }
    callback(this[i], i, block)
  }
}

Array.prototype.position = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i)) return Some(i)
  }
  return None
}
Array.prototype.rposition = function (callback) {
  for (let i = this.length - 1; i >= 0; i--) {
    if (callback(this[i], i)) return Some(i)
  }
  return None
}

Object.defineProperty(Array, 'default', {
  value: function () {
    return []
  },
  writable: false,
})

export {}

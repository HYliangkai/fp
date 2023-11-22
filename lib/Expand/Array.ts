declare global {
  interface Array<T> {
    zip<V>(arr: Array<V>): [Array<T>, Array<V>]
    max(): T extends number ? number : never
    min(): T extends number ? number : never
    for_each(callback: (item: T, index: number, block: () => void) => any): void
    to_push(value: T): Array<T>
    to_pop(value: T): Array<T>
    to_shift(value: T): Array<T>
    to_unshift(value: T): Array<T>
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

export {}

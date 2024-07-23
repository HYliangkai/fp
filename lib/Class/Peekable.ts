import { None, type Option, Some } from '../../mod.ts'

/** ## ## Peekable : 可提前`前瞻`iterable下一个数据
由于iterable具有一次消耗性,调用next()之后就无法返回.Peekable能提前`看`下一个数据,能解决这一问题场景
@example:
```ts
  const arr: Iterable<number> = [1, 2, 33, 4, 5]
  const peek = new Peekable(arr)

  assert(peek.next().unwarp() === 1)

  assert(peek.peeked.unwarp() === 2)

  assert(peek.peeked.unwarp() == peek.next().unwarp())
  assert(peek.next().unwarp() !== peek.peeked.unwarp())
```
@category Class
 */
export class Peekable<V, T extends Iterable<V> | Iterator<V>> {
  private iter: Iterator<V>
  private peek_value: IteratorResult<V, any>
  private peek_data: Option<V>

  constructor(iter: T, itable = true) {
    this.iter = itable ? (iter as Iterable<V>)[Symbol.iterator]() : (iter as Iterator<V>)
    this.peek_value = this.iter.next()
    this.peek_data = this.peek_value.done
      ? None
      : this.peek_value.value === null || this.peek_value.value === undefined
      ? None
      : Some(this.peek_value.value)
  }

  public get peeked(): Option<V> {
    return this.peek_data
  }

  next(): Option<V> {
    const pd = this.peek_data
    this.peek_value = this.iter.next()
    this.peek_data = this.peek_value.done
      ? None
      : this.peek_value.value === null || this.peek_value.value === undefined
      ? None
      : Some(this.peek_value.value)
    return pd
  }
}

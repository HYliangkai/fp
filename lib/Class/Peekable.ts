import {None, Option, Some} from '../../mod.ts'

/** ## Can 'peek' with Iterator
example:
```ts
  const arr: Iterable<number> = [1, 2, 33, 4, 5]
  const peek = new Peekable(arr)

  assert(peek.next().unwarp() === 1)

  assert(peek.peeked.unwarp() === 2)

  assert(peek.peeked.unwarp() == peek.next().unwarp())
  assert(peek.next().unwarp() !== peek.peeked.unwarp())
```
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

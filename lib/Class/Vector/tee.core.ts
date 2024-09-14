//采用<数据结构>[队列] 解决迭代器消耗问题

/** 队列节点 */
interface QueueNode<T> {
  value: T
  next: QueueNode<T> | undefined
}

class Queue<T> {
  source: Generator<T>
  head: QueueNode<T>
  queue: QueueNode<T> | undefined
  done: boolean

  constructor(iter: Generator<T>) {
    this.source = iter[Symbol.iterator]()
    this.queue = {
      value: undefined!,
      next: undefined,
    }
    this.head = this.queue
    this.done = false
  }

  next(): void {
    const res = this.source.next()
    if (res.done) {
      this.done = true
    } else {
      const next_node: QueueNode<T> = {
        value: res.value,
        next: undefined,
      }
      this.queue!.next = next_node
      this.queue = next_node
    }
  }
}

/** tee : 解决Iterator一次性消耗问题. 将Iterator一分为二  */
export function tee<T>(iter: Generator<T>): [Generator<T>, Generator<T>] {
  const queue = new Queue(iter)

  function* generator(): Generator<T> {
    let buffer = queue.head
    while (true) {
      if (buffer.next) {
        buffer = buffer.next
        yield buffer.value // 喷射下一块数据
      } else if (queue.done) {
        return
      } else {
        queue.next()
      }
    }
  }

  return Array.from({ length: 2 }).map(generator) as [Generator<T>, Generator<T>]
}

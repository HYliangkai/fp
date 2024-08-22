import { AnyResult, AsyncResult, Ok, Task } from '@chzky/fp'
import { assert, assertEquals } from '@std/assert/mod.ts'
import { assert_sequence } from '@chzky/cest'
import { Spinner } from '@std/cli'

Deno.test('task-base', async () => {
  const seq = assert_sequence()

  const task = new Task(2)

  // 1[] : 200
  task
    .add_task(
      () =>
        new Promise<AnyResult<number>>((resolve) => {
          setTimeout(() => {
            resolve(Ok(1))
          }, 200)
        })
    )
    .then(() => {
      seq(3)
    })

  // 2[] : 100
  task
    .add_task(
      () =>
        new Promise<AnyResult<number>>((resolve) => {
          setTimeout(() => {
            resolve(Ok(1))
          }, 100)
        })
    )
    .then(() => {
      seq(1)
    })

  // 2[] : 80
  task
    .add_task(
      () =>
        new Promise<AnyResult<number>>((resolve) => {
          setTimeout(() => {
            resolve(Ok(1))
          }, 80)
        })
    )
    .then(() => {
      seq(2)
    })

  task.log()

  await new Promise<AnyResult<number>>((resolve) => {
    setTimeout(() => {
      resolve(Ok(1))
    }, 500)
  })
})

import { IllegalOperatError, Ok, produce, type Result, type Immutable, type Draft } from '@chzky/fp'

export function immut_produce<T, R = void>(
  data: Immutable<T>,
  fn: (draft: Draft<T>) => R
): Result<Immutable<R extends void ? T : R>, IllegalOperatError> {
  try {
    const res = produce(data, fn as any) as Immutable<R extends void ? T : R>
    return Ok(res)
  } catch (e) {
    if (
      e instanceof Error &&
      e.message ===
        '[Immer] An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.'
    ) {
      return IllegalOperatError.err(e.message)
    } else {
      throw e
    }
  }
}

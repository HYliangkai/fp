import type { AsyncResult, Result } from './interface.ts'
import { Ok } from './ok.ts'
import { Err, is_err } from './err.ts'
import { BackTrack, backtrack } from './backtrack.ts'
import { result, async_result } from './helper.ts'

export {
  Ok,
  Err,
  BackTrack,
  result,
  is_err,
  backtrack,
  async_result,
  type Result,
  type AsyncResult,
}

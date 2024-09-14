import { match, None, Option, pipe, reversal, Some } from '@chzky/fp'
import { assert } from '@std/assert/mod.ts'

Deno.test('reversal-base', () => {
  const some: Option<boolean> = Some(true)

  //在match中使用
  const mres = match(some)
    .case((v) => v.as('boolean'), true) // like :  case((val)=>val.as(),true)
    .done(false)
  assert(mres)

  //在pipe中使用
  const pres = pipe(true, Some, reversal('unwrap'))
  assert(pres)

  //取值
  const nres = pipe(None, reversal('is_none')) // like : None.is_none
  assert(nres)
})

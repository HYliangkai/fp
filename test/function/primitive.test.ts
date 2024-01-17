import {provided} from 'lib'
import {assertEquals} from '../mod.ts'

Deno.test('primitive-provided', () => {
  const judgT = 'A' == 'A'
  const judgF = 1 + 2 == 2

  const r1 = provided(judgT, 'R1')
  const r11 = provided(judgT, () => 'R1')
  assertEquals(r1, 'R1')
  assertEquals(r11, 'R1')

  const r2 = provided(judgF, 'R2')
  const r22 = provided(judgF, () => 'R2')
  assertEquals(r2, false)
  assertEquals(r22, false)

  const r3 = provided.option(judgF, 'R3').unwrap_or('R4')
  const r33 = provided.option(judgF, () => 'R3').unwrap_or('R4')
  assertEquals(r3, 'R4')
  assertEquals(r33, 'R4')

  const r4 = provided.option(judgT, 'R3').unwrap_or('R4')
  const r44 = provided.option(judgT, () => 'R3').unwrap_or('R4')
  assertEquals(r4, 'R3')
  assertEquals(r44, 'R3')
})

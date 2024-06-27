import { provided, and, or } from 'lib'
import { assertEquals } from '../mod.ts'

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

Deno.test('and', () => {
  const judgT = 'A' == 'A'
  const judgF = 1 + 2 == 2

  const r1 = and(judgT, judgT)
  assertEquals(r1, true)

  const r2 = and(judgT, judgF)
  assertEquals(r2, false)

  const r3 = and(judgF, judgT)
  assertEquals(r3, false)

  const r4 = and(judgF, judgF)
  assertEquals(r4, false)
})

Deno.test('or', () => {
  const judgT = 'A' == 'A'
  const judgF = 1 + 2 == 2

  const r1 = or(judgT, judgT)
  assertEquals(r1, true)

  const r2 = or(judgT, judgF)
  assertEquals(r2, true)

  const r3 = or(judgF, judgT)
  assertEquals(r3, true)

  const r4 = or(judgF, judgF)
  assertEquals(r4, false)
})

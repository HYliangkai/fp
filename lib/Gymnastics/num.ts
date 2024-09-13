/** ## `Integer<I>` : 限制数字类型为整数
@category Gymnastics */
export type Integer<I extends number> = `${I}` extends `${number}.${number}` ? never : I

/** ## `Positive<P>` : 限制数字类型为正数
@category Gymnastics */
export type Positive<P extends number> = `${P}` extends `-${number}` ? never : P

/** ## `Negative<N>` : 限制数字类型为负数
@category Gymnastics */
export type Negative<N extends number> = `${N}` extends `${number}` ? never : N

/** ## `NonZero<NZ>` : 限制数字类型为非零
@category Gymnastics */
export type NonZero<NZ extends number> = `${NZ}` extends `0` ? never : NZ

/** ## `PositiveInteger<PI>` : 限制数字类型为正整数
@category Gymnastics */
export type PositiveInteger<PI extends number> = `${PI}` extends `-${number}`
  ? never
  : `${PI}` extends `${number}.${number}`
  ? never
  : PI

/** ## `NegativeInteger<NI>` : 限制数字类型为负整数
@category Gymnastics */
export type NegativeInteger<NI extends number> = `${NI}` extends `${number}`
  ? never
  : `${NI}` extends `${number}.${number}`
  ? never
  : NI

/** ## `NonZeroPositiveInteger<NZPI>` : 限制数字类型为非零正整数
@category Gymnastics */
export type NonZeroPositiveInteger<NZPI extends number> = `${NZPI}` extends `-${number}`
  ? never
  : `${NZPI}` extends `0`
  ? never
  : `${NZPI}` extends `${number}.${number}`
  ? never
  : NZPI

/** ## `NonZeroNegativeInteger<NZNI>` : 限制数字类型为非零负整数
@category Gymnastics */
export type NonZeroNegativeInteger<NZNI extends number> = `${NZNI}` extends `${number}`
  ? never
  : `${NZNI}` extends `0`
  ? never
  : `${NZNI}` extends `${number}.${number}`
  ? never
  : NZNI

/** ## `Decimal<D>` : 限制数字类型为小数
@category Gymnastics */
export type Decimal<D extends number> = `${D}` extends `${number}.${number}` ? D : never

/** ## `RangeNumber<N>` : 表示小于等于N的数字类型
@example
```ts
type A = RangeNumber<3> // 0 | 1 | 2 | 3
```
@category Gymnastics
 */
export type RangeNumber<N extends number, Arr extends number[] = []> = Arr['length'] extends N
  ? Arr[number]
  : RangeNumber<N, [...Arr, Arr['length']]>

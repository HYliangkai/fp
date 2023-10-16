/** ### = */
export const Eq = Symbol('=')
/** ### >= */
export const Ge = Symbol('>=')
/** ### > */
export const Gr = Symbol('>')
/** ### <= */
export const Le = Symbol('<=')
/** ### < */
export const Lr = Symbol('<')
/** ### incomparable */
export const Icmp = Symbol('incomparable')

export type Ord<T = boolean> = T extends true
  ? typeof Gr | typeof Ge | typeof Lr | typeof Le | typeof Icmp
  : typeof Eq | typeof Gr | typeof Lr | typeof Icmp

/** Main compare sub; the result is Ord
+ merge == true : Ord has Ge,Le , no has Eq    
+ merge == false (default) : Ord has Eq , no has Ge,Le  
*/
export const cmp = <T extends boolean = false>(main: any, sub: any, merge?: T): Ord<T> =>
  //@ts-ignore
  !merge
    ? main === sub
      ? Eq
      : main > sub
      ? Gr
      : main < sub
      ? Lr
      : Icmp
    : main === sub
    ? main > sub
      ? Ge
      : Le
    : main > sub
    ? Gr
    : main < sub
    ? Lr
    : Icmp

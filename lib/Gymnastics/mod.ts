export type ValueOrFunc<T> = T | (() => T)
export type JudeCondition<T> = (val: T) => boolean
export type Condition<T> = T | JudeCondition<T>

/* 提供一系列原语指令 */

import {None, ValueOrFunc, option} from '../../mod.ts'

interface provided {
  <T>(condition: boolean, handle: ValueOrFunc<T>): false | T
  option: <T>(condition: boolean, handle: ValueOrFunc<T>) => Option<NonNullable<T>>
}

/**
 * ##
 */

export const provided: provided = (<T>(condition: boolean, handle: ValueOrFunc<T>): false | T =>
  condition && (typeof handle === 'function' ? (handle as Function)() : handle)) as any

Object.defineProperty(provided, 'option', {
  enumerable: true,
  writable: false,
  value<T>(condition: boolean, handle: T | (() => T)): Option<NonNullable<T>> {
    return condition ? option(typeof handle === 'function' ? (handle as Function)() : handle) : None
  },
})

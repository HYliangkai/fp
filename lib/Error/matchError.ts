import {AnyError, ErrorLevel} from './mod.ts'

/**   error match  */
export const match_error = (
  error: any
): {
  handle: (is: (error: AnyError<ErrorLevel>) => any, other: (error: any) => any) => any
  handle_throw: <T>(is: (error: AnyError<ErrorLevel>) => T) => any
  debug: (is: (error: AnyError<'Debug'>) => any, other: (error: any) => any) => any
  debug_throw: (is: (error: AnyError<'Debug'>) => unknown) => any
  info: (is: (error: AnyError<'Info'>) => any, other: (error: any) => any) => any
  info_throw: (is: (error: AnyError<'Info'>) => unknown) => any
  warn: (is: (error: AnyError<'Warn'>) => any, other: (error: any) => any) => any
  warn_throw: (is: (error: AnyError<'Warn'>) => unknown) => any
  error: (is: (error: AnyError<'Error'>) => any, other: (error: any) => any) => any
  error_throw: (is: (error: AnyError<'Error'>) => unknown) => any
  fatal: (is: (error: AnyError<'Fatal'>) => any, other: (error: any) => any) => any
  fatal_throw: (is: (error: AnyError<'Fatal'>) => unknown) => any
  panic: (is: (error: AnyError<'Panic'>) => any, other: (error: any) => any) => any
  panic_throw: (is: (error: AnyError<'Panic'>) => unknown) => any
  loginfo: (is: (error: AnyError<'Info' | 'Debug'>) => any, other: (error: any) => any) => any
  logininfo_throw: (is: (error: AnyError<'Info' | 'Debug'>) => unknown) => any
  recoverable: (is: (error: AnyError<'Error'>) => any, other: (error: any) => any) => any
  recoverable_throw: (is: (error: AnyError<'Error'>) => unknown) => any
  unrecoverable: (
    is: (error: AnyError<'Panic' | 'Fatal'>) => any,
    other: (error: any) => any
  ) => any
  unrecoverable_throw: (is: (error: AnyError<'Panic' | 'Fatal'>) => unknown) => any
} => {
  return {
    /** match any error */
    handle(is: (error: AnyError<ErrorLevel>) => any, other: (error: any) => any) {
      return error instanceof AnyError ? is(error) : other(error)
    },
    /** match any error , or thorw other */
    handle_throw<T>(is: (error: AnyError<ErrorLevel>) => T) {
      if (error instanceof AnyError) {
        return is(error)
      } else {
        throw error
      }
    },
    /** match debug */
    debug(is: (error: AnyError<'Debug'>) => any, other: (error: any) => any) {
      return error instanceof AnyError && error.type === 'Debug' ? is(error) : other(error)
    },
    /** match debug , or thorw other */
    debug_throw(is: (error: AnyError<'Debug'>) => unknown) {
      if (error instanceof AnyError && error.type === 'Debug') {
        return is(error)
      } else {
        throw error
      }
    },
    /** match info */
    info(is: (error: AnyError<'Info'>) => any, other: (error: any) => any) {
      return error instanceof AnyError && error.type === 'Info' ? is(error) : other(error)
    },
    /** match info , or thorw other */
    info_throw(is: (error: AnyError<'Info'>) => unknown) {
      if (error instanceof AnyError && error.type === 'Info') {
        return is(error)
      } else {
        throw error
      }
    },
    /** match warn */
    warn(is: (error: AnyError<'Warn'>) => any, other: (error: any) => any) {
      return error instanceof AnyError && error.type === 'Warn' ? is(error) : other(error)
    },
    /** match warn , or thorw other */
    warn_throw(is: (error: AnyError<'Warn'>) => unknown) {
      if (error instanceof AnyError && error.type === 'Warn') {
        return is(error)
      } else {
        throw error
      }
    },
    /** match error */
    error(is: (error: AnyError<'Error'>) => any, other: (error: any) => any) {
      return error instanceof AnyError && error.type === 'Error' ? is(error) : other(error)
    },
    /** match error , or thorw other */
    error_throw(is: (error: AnyError<'Error'>) => unknown) {
      if (error instanceof AnyError && error.type === 'Error') {
        return is(error)
      } else {
        throw error
      }
    },
    /** match fatal */
    fatal(is: (error: AnyError<'Fatal'>) => any, other: (error: any) => any) {
      return error instanceof AnyError && error.type === 'Fatal' ? is(error) : other(error)
    },
    /** match fatal , or thorw other */
    fatal_throw(is: (error: AnyError<'Fatal'>) => unknown) {
      if (error instanceof AnyError && error.type === 'Fatal') {
        return is(error)
      } else {
        throw error
      }
    },

    /** match panic */
    panic(is: (error: AnyError<'Panic'>) => any, other: (error: any) => any) {
      return error instanceof AnyError && error.type === 'Panic' ? is(error) : other(error)
    },
    /** match panic , or thorw other */
    panic_throw(is: (error: AnyError<'Panic'>) => unknown) {
      if (error instanceof AnyError && error.type === 'Panic') {
        return is(error)
      } else {
        throw error
      }
    },

    /** debug - info */
    loginfo(is: (error: AnyError<'Info' | 'Debug'>) => any, other: (error: any) => any) {
      return error instanceof AnyError && (error.type === 'Info' || error.type === 'Debug')
        ? is(error)
        : other(error)
    },
    /** debug - info , or thorw other */
    logininfo_throw(is: (error: AnyError<'Info' | 'Debug'>) => unknown) {
      if (error instanceof AnyError && (error.type === 'Info' || error.type === 'Debug')) {
        return is(error)
      } else {
        throw error
      }
    },
    /** error */
    recoverable(is: (error: AnyError<'Error'>) => any, other: (error: any) => any) {
      return error instanceof AnyError && error.type === 'Error' ? is(error) : other(error)
    },
    /** error , or thorw other */
    recoverable_throw(is: (error: AnyError<'Error'>) => unknown) {
      if (error instanceof AnyError && error.type === 'Error') {
        return is(error)
      } else {
        throw error
      }
    },
    /** fatal - panic */
    unrecoverable(is: (error: AnyError<'Panic' | 'Fatal'>) => any, other: (error: any) => any) {
      return error instanceof AnyError && (error.type === 'Panic' || error.type === 'Fatal')
        ? is(error)
        : other(error)
    },
    /** fatal - panic , or thorw other */
    unrecoverable_throw(is: (error: AnyError<'Panic' | 'Fatal'>) => unknown) {
      if (error instanceof AnyError && (error.type === 'Panic' || error.type === 'Fatal')) {
        return is(error)
      } else {
        throw error
      }
    },
  }
}

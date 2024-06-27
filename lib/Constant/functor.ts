/** 参数函子 */

export const Proxy_Value = Symbol('PV')
export const Functor_Param_Tag = Symbol('FPT')

const proxy_functor_param = (val: string | Symbol): any =>
  new Proxy(
    {},
    {
      get: (_target, key) => {
        if (key === Proxy_Value) return val
        if (key === Functor_Param_Tag) return true
        if (key === Symbol.toStringTag) return 'Functor Param'
        return proxy_functor_param(`${val}['${String(key)}']`)
      },
      has: () => true,
      set: () => false,
      deleteProperty: () => false,
      defineProperty: () => false,
      isExtensible: () => false,
    }
  )

export const $0 = proxy_functor_param('$0')
export const $1 = proxy_functor_param('$1')
export const $2 = proxy_functor_param('$2')
export const $3 = proxy_functor_param('$3')
export const $4 = proxy_functor_param('$4')
export const $5 = proxy_functor_param('$5')
export const $6 = proxy_functor_param('$6')
export const $7 = proxy_functor_param('$7')
export const $8 = proxy_functor_param('$8')
export const $9 = proxy_functor_param('$9')

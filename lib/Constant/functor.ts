export const Proxy_Value = Symbol('PV')
export const Functor_Param_Tag = Symbol('FPT')
/** 参数函子,配合functor使用 
  +  `$0.name.age` --> `$0['name']['age']`
  @category Constant
   */
const proxy_functor_param = (val: string): any =>
  new Proxy(
    {},
    {
      has: () => true,
      set: () => false,
      deleteProperty: () => false,
      defineProperty: () => false,
      isExtensible: () => false,
      get: (_target, key) => {
        if (key === Proxy_Value) return val
        if (key === Functor_Param_Tag) return true
        if (key === Symbol.toStringTag) return 'Functor Param'
        return proxy_functor_param(`${val}['${String(key)}']`)
      },
    }
  )

export const $0: any = proxy_functor_param('$0')
export const $1: any = proxy_functor_param('$1')
export const $2: any = proxy_functor_param('$2')
export const $3: any = proxy_functor_param('$3')
export const $4: any = proxy_functor_param('$4')
export const $5: any = proxy_functor_param('$5')
export const $6: any = proxy_functor_param('$6')
export const $7: any = proxy_functor_param('$7')
export const $8: any = proxy_functor_param('$8')
export const $9: any = proxy_functor_param('$9')

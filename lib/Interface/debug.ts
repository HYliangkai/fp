import { zod } from '@chzky/fp'

/** ## Debug : 自定义debug接口 
@category Interface
*/
export interface Debug<T = void> {
  readonly log: () => T
}

/** ## `implements_debug` : duck type to judge Debug type @category Interface */
export function implements_debug(value: unknown): value is Debug {
  return zod.object({ log: zod.function() }).safeParse(value).success
}

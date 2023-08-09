import { Own } from '../lib/Own.ts'
import { None, Some } from '../mod.ts'

/** 二元match,其实就是if只不过有更好的类型安全和函数式语法 */

let value = Date.now() % 2 === 0 ? Some('✅') : None

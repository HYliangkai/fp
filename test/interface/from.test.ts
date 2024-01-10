import {From} from 'lib'
import {assert} from '../mod.ts'

Deno.test('from', () => {
  const AstrConstructor: From<Cstr, Astr> = {
    from(val: Cstr): Astr {
      return new Astr(Number(val.str))
    },
  }
  class Astr {
    constructor(public str: number) {}
    to(): string | Cstr {
      throw new Error('Method not implemented.')
    }
  }

  const CstrConstructor: From<Astr, Cstr> = {
    from(val: Astr): Cstr {
      return new Cstr(String(val.str), 18)
    },
  }
  class Cstr {
    constructor(public str: string, private age: number) {}
  }

  assert(AstrConstructor.from(new Cstr('18', 18)) instanceof Astr)
  assert(CstrConstructor.from(new Astr(18)) instanceof Cstr)
})

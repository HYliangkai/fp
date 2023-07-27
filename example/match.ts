import { match } from 'npm:ts-pattern'
import { Own } from '../lib/Own.ts'

let A = () => Date.now() % 2 === 0 ? Own(true) : Own('none')
match(A())
  .with(Own(true), () => {
    console.log('pattern true')
  })
  .with(Own('none'), () => {
    console.log('pattern none')
  })
  .run()

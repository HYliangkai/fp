import {result, zod} from 'lib'
/** zod结合result可以做到有效的类型安全 */

const shema = zod.object({
  name: zod.string({description: '字符串校验'}),
  age: zod.number(),
  address: zod.object({
    now: zod.literal('now'),
    live: zod.string(),
  }),
})
type User = zod.infer<typeof shema>

function mock_data() {
  return new Promise((res, _rej) => {
    setTimeout(() => {
      res({
        name: 'jiojio',
        age: 18,
        address: {
          now: 'now',
          live: 20, //类型错误
        },
      })
    }, 2333)
  })
}

//使用zod能将未知的数据进行校验,转化为Result类型,从而保证获取数据的类型安全
const res = await mock_data()
const value = result<User | string, Error>(() => shema.parse(res))
console.log(value.unwarp_or('错误')) //错误//Json数据配置

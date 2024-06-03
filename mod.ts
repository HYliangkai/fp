export * from './lib/mod.ts'

const aa = [(v: any) => v]
aa.forEach(v => {
  console.log(typeof v)
})
import { run_effect, wait } from '@chzky/fp'

const adtt = async () => {
  const pro1: string = await new Promise((res) => {
    setTimeout(() => {
      res('好的')
    }, 3000)
  })
  return pro1
}

const abct = async () => {
  const pro2: string = await new Promise((res) =>
    setTimeout(() => {
      res('嗯嗯')
    }, 2000)
  )
  return pro2
}

const running = () => {
  const A = wait(abct)
  const C = wait(adtt)
  return A
}

function main() {
  run_effect(running, (res) => {
    console.log(res.unwrap())
    console.log('执行完毕')
  })
}

main()

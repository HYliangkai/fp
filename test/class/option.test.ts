type AMO = {
  opt: Option<null>
  name?: string
  age: number
  address: number | string
  avg: number | null
  info: {
    idcard: string | undefined
    sun: Option<null>
  }
  cb: () => void
  ad: Function
  arr: Array<string | null>
  umn: [null | string, undefined]
}

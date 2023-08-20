import { Own } from '../mod.ts'

const now = new Date().getTime()

//如果 now %2 === 0 需要返回now否则返回None

// OwnNumber --> OwnBoolean (丢失了now的信息,使得下文无法获取now,只能通过闭包的形式获取外部数据)
Own(now % 2).is_match(0)

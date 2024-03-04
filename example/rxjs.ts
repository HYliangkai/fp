import rxj from 'npm:rxjs@7.8.1'

//一个独立的响应式库,主要聚焦于如何更好的封装 观察/订阅者 模式的数据

//创建一个观察者

const observable = new rxj.Observable(subscribe => {
  //可以操作订阅者的api
  /* api1:进入next回调 */
  subscribe.next('next回调')
  /* api2:进入complete回调,complete回调不能传入参数,它表示一个动作完成的操作,一般用来做数据总结 */
  subscribe.complete()
  /* 使用complete之后就不能调用next了 */
  subscribe.next('再来一次')
})

//加入一个订阅
observable.subscribe({
  next(val) {
    // console.log('第一个订阅获取到val', val)
  },
  complete() {
    // console.log('第一个订阅结束了')
  },
})
//订阅执行顺序是从上往下的,也就是先执行完第一个订阅的回调再执行第二个订阅的回调
//订阅 Observable 类似于调用 Function。 --> 但是它比函数优越的地方在于能在不同时间返回多个值
/**
所以subscrib绝对不是eventhandle ,和addEventListener不同之处在于addEventListener是分阶段发生的,虽然subscrib也是分阶段发生的,但是他在大阶段里面细分了几个小阶段,而小阶段的执行是随着大阶段一起同步发生的

因此可以理解为rxjs是对一段会发生变化的数据的订阅,而不是对一个事件的订阅
而将会发生变化的数据统一称之为Observable类
所以学习有两点 :
1. 如何将数据变成Observable类
2. 如何操作Observable类
*/
observable.subscribe({
  next(val) {
    console.log('第二个订阅获取val', val)
  },
  complete() {
    console.log('第二个订阅结束了')
  },
})

/** @异步调用示例 */

const obs = new rxj.Observable(sub => {
  //异步调用只能在回调里面使用next,而不能使用async/await 做同步延迟
  setTimeout(() => {
    sub.next(1)
    setTimeout(() => {
      sub.next(2333)
      //complete 和 error 只会调用一次,调用之后订阅者走向finish,不会调用下一个next
      sub.error('就是错')
    }, 2333)
  }, 2333)
})

const sub = obs.subscribe({
  next(val) {
    console.log('异步调用结果', val)
  },
  error(err) {
    console.log('错误原因', err)
  },
  complete() {
    console.log('调用结束')
  },
})

//可直接取消消息订阅
console.log('直接取消订阅,不会触发后续回调')
sub.unsubscribe()

/** @生成观察者 , 以下的生成方式都可以通过 new Observable()来生成,只是下面提供了建议函数生成 */

/** 1. 从一组参数中生成,类似yield ...rest */
const obs1 = rxj.of(1, 2, 3, 4, 5)
/** 2. 从可迭代数组中迭代生成 */
const obs2 = rxj.from([1, 2, 3, 4, 5])
/** 3. 从循环计时器中循环生成,但是没有初始值 */
const obs3 = rxj.interval(1000)
/** 4. 从具有addEventListener的事件中绑定*/
const obs4 = rxj.fromEvent(window, 'error')
/** 5. 从一对数据范围中生成 */
const obs5 = rxj.range(1, 10)
/** 6. 从true/false中生成 */
let flag = false
const obs6 = rxj.iif(() => flag, rxj.of('对的'), rxj.of('错误的'))
obs6.subscribe(val => {
  flag = !flag
  console.log(val)
})
obs6.subscribe(val => {
  console.log(val)
})
/** 7.从定时器 */
const obs7 = rxj.timer(2333)

/** @订阅数据操作 */

/* 管道操作pipe ,纯函数 ,返回一个操作后的新observable */
obs1
  .pipe(
    rxj.map(x => x * 12),
    rxj.map(x =>
      rxj.interval(1000).pipe(
        rxj.map(() => x * 2),
        rxj.take(4) /* 取多少值 */
      )
    ) /* 再次返回一个观察者 */,
    // rxj.concatAll(), /* 将所有订阅打平,相当于给每个值做一次subscribe  先统计外部obs的结果 -> 统计外部obs */
    rxj.mergeAll() /* 将每组订阅打平然后发出 先统计外部obs -> 后统计内部obs  */
  )
  .subscribe(val => {
    console.log(val)
  })

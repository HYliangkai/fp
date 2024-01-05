/** ## sleep : 线程休眠
@example
```ts
sleep(1000).then(() => {
  console.log('sleep 1000ms')
})
```
@category Function
*/
export const sleep = (time = 1000, random = false) =>
  new Promise(resolve => {
    setTimeout(resolve, random ? Math.floor(Math.random() * time) : time)
  })

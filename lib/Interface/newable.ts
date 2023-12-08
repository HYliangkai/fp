/** ## Newable  表示一个可调用 new() 函数可代替构造函数的行为
Example:
```ts
```ts
 */
export interface Newable {
  new (): this
}

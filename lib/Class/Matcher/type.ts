export enum ErrorCase {
  WHRN_TYPE_ERROR = 'Match.when() second argument must be a function',
  NO_ARRAY = 'Must pass in an array',
  EMPTY_ARRAY = 'Array is empty',
  NEED_STATE = 'State must be passed in',
}
export type CaseInfo = {
  immediate: boolean /* 如果case是个函数是否立刻执行 */
  every?: boolean /* 用于区分some函数还是every函数的标志 */
  state?: boolean /* 用于区分when_state函数 */
}

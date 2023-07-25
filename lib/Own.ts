/** Own 辅助类型,作为类型调用的辅助类,为了更好的做函数的链式调用 */

interface Own<T> {
  is_array(): Own<T>
  is_empty_array(): Own<T>
}

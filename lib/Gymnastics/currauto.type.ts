export interface CurrAuto2<T, U, V> {
  (arg: T): (arg2: U) => V
  (arg: T, arg2: U): V
}

export interface CurrAuto3<T, U, V, W> {
  (arg: T): CurrAuto2<U, V, W>
  (arg: T, arg2: U): (arg3: V) => W
  (arg: T, arg2: U, arg3: V): W
}

export interface CurrAuto4<T, U, V, W, X> {
  (arg: T): CurrAuto3<U, V, W, X>
  (arg: T, arg2: U): CurrAuto2<V, W, X>
  (arg: T, arg2: U, arg3: V): (arg4: W) => X
  (arg: T, arg2: U, arg3: V, arg4: W): X
}

export interface CurrAuto5<T, U, V, W, X, Y> {
  (arg: T): CurrAuto4<U, V, W, X, Y>
  (arg: T, arg2: U): CurrAuto3<V, W, X, Y>
  (arg: T, arg2: U, arg3: V): CurrAuto2<W, X, Y>
  (arg: T, arg2: U, arg3: V, arg4: W): (arg5: X) => Y
  (arg: T, arg2: U, arg3: V, arg4: W, arg5: X): Y
}

export interface CurrAuto6<T, U, V, W, X, Y, Z> {
  (arg: T): CurrAuto5<U, V, W, X, Y, Z>
  (arg: T, arg2: U): CurrAuto4<V, W, X, Y, Z>
  (arg: T, arg2: U, arg3: V): CurrAuto3<W, X, Y, Z>
  (arg: T, arg2: U, arg3: V, arg4: W): CurrAuto2<X, Y, Z>
  (arg: T, arg2: U, arg3: V, arg4: W, arg5: X): (arg6: Y) => Z
  (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y): Z
}

export interface CurrAuto7<T, U, V, W, X, Y, Z, A> {
  (arg: T): CurrAuto6<U, V, W, X, Y, Z, A>
  (arg: T, arg2: U): CurrAuto5<V, W, X, Y, Z, A>
  (arg: T, arg2: U, arg3: V): CurrAuto4<W, X, Y, Z, A>
  (arg: T, arg2: U, arg3: V, arg4: W): CurrAuto3<X, Y, Z, A>
  (arg: T, arg2: U, arg3: V, arg4: W, arg5: X): CurrAuto2<Y, Z, A>
  (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y): (arg7: Z) => A
  (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z): A
}

export interface CurrAuto8<T, U, V, W, X, Y, Z, A, B> {
  (arg: T): CurrAuto7<U, V, W, X, Y, Z, A, B>
  (arg: T, arg2: U): CurrAuto6<V, W, X, Y, Z, A, B>
  (arg: T, arg2: U, arg3: V): CurrAuto5<W, X, Y, Z, A, B>
  (arg: T, arg2: U, arg3: V, arg4: W): CurrAuto4<X, Y, Z, A, B>
  (arg: T, arg2: U, arg3: V, arg4: W, arg5: X): CurrAuto3<Y, Z, A, B>
  (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y): CurrAuto2<Z, A, B>
  (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z): (arg8: A) => B
  (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z, arg8: A): B
}

export interface CurrAuto2Rev<T, U, V> {
  (arg2: U): (arg: T) => V
  (arg2: U, arg: T): V
}

export interface CurrAuto3Rev<T, U, V, W> {
  (arg3: V): CurrAuto2Rev<T, U, W>
  (arg3: V, arg2: U): (arg: T) => W
  (arg3: V, arg2: U, arg: T): W
}

export interface CurrAuto4Rev<T, U, V, W, X> {
  (arg4: W): CurrAuto3Rev<T, U, V, X>
  (arg4: W, arg3: V): CurrAuto2Rev<T, U, X>
  (arg4: W, arg3: V, arg2: U): (arg: T) => X
  (arg4: W, arg3: V, arg2: U, arg: T): X
}

export interface CurrAuto5Rev<T, U, V, W, X, Y> {
  (arg5: X): CurrAuto4Rev<T, U, V, W, Y>
  (arg5: X, arg4: W): CurrAuto3Rev<T, U, V, Y>
  (arg5: X, arg4: W, arg3: V): CurrAuto2Rev<T, U, Y>
  (arg5: X, arg4: W, arg3: V, arg2: U): (arg: T) => Y
  (arg5: X, arg4: W, arg3: V, arg2: U, arg: T): Y
}

export interface CurrAuto6Rev<T, U, V, W, X, Y, Z> {
  (arg6: Y): CurrAuto5Rev<T, U, V, W, X, Z>
  (arg6: Y, arg5: X): CurrAuto4Rev<T, U, V, W, Z>
  (arg6: Y, arg5: X, arg4: W): CurrAuto3Rev<T, U, V, Z>
  (arg6: Y, arg5: X, arg4: W, arg3: V): CurrAuto2Rev<T, U, Z>
  (arg6: Y, arg5: X, arg4: W, arg3: V, arg2: U): (arg: T) => Z
  (arg6: Y, arg5: X, arg4: W, arg3: V, arg2: U, arg: T): Z
}

export interface CurrAuto7Rev<T, U, V, W, X, Y, Z, A> {
  (arg7: Z): CurrAuto6Rev<T, U, V, W, X, Y, A>
  (arg7: Z, arg6: Y): CurrAuto5Rev<T, U, V, W, X, A>
  (arg7: Z, arg6: Y, arg5: X): CurrAuto4Rev<T, U, V, W, A>
  (arg7: Z, arg6: Y, arg5: X, arg4: W): CurrAuto3Rev<T, U, V, A>
  (arg7: Z, arg6: Y, arg5: X, arg4: W, arg3: V): CurrAuto2Rev<T, U, A>
  (arg7: Z, arg6: Y, arg5: X, arg4: W, arg3: V, arg2: U): (arg: T) => A
  (arg7: Z, arg6: Y, arg5: X, arg4: W, arg3: V, arg2: U, arg: T): A
}

export interface CurrAuto8Rev<T, U, V, W, X, Y, Z, A, B> {
  (arg8: A): CurrAuto7Rev<T, U, V, W, X, Y, Z, B>
  (arg8: A, arg7: Z): CurrAuto6Rev<T, U, V, W, X, Y, B>
  (arg8: A, arg7: Z, arg6: Y): CurrAuto5Rev<T, U, V, W, X, B>
  (arg8: A, arg7: Z, arg6: Y, arg5: X): CurrAuto4Rev<T, U, V, W, B>
  (arg8: A, arg7: Z, arg6: Y, arg5: X, arg4: W): CurrAuto3Rev<T, U, V, B>
  (arg8: A, arg7: Z, arg6: Y, arg5: X, arg4: W, arg3: V): CurrAuto2Rev<T, U, B>
  (arg8: A, arg7: Z, arg6: Y, arg5: X, arg4: W, arg3: V, arg2: U): (arg: T) => B
  (arg8: A, arg7: Z, arg6: Y, arg5: X, arg4: W, arg3: V, arg2: U, arg: T): B
}

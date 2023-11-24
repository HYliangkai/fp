declare global {
  interface NUmberConstructor {
    /** number default is `0` */
    default(): 0
  }
}

Object.defineProperty(Number, 'default', {
  value: function () {
    return 0
  },
  writable: false,
})

export {}

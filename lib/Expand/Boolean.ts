declare global {
  interface NUmberConstructor {
    /** boolean default is `false` */
    default(): false
  }
}

Object.defineProperty(Boolean, 'default', {
  value: function () {
    return false
  },
  writable: false,
})

export {}

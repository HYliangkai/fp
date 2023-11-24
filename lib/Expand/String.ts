declare global {
  interface StringConstructor {
    /** string default is `''` */
    default(): ''
  }
}

Object.defineProperty(String, 'default', {
  value: function () {
    return ''
  },
  writable: false,
})

export {}

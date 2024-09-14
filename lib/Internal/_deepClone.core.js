// deno-lint-ignore-file no-self-compare no-var no-undef no-empty
// dts/src/eq.ts
function eq(value, other) {
  return value === other || (value !== value && other !== other)
}
var eq_default = eq

// dts/src/.internal/assocIndexOf.ts
function assocIndexOf(array, key) {
  let { length } = array
  while (length--) {
    if (eq_default(array[length][0], key)) {
      return length
    }
  }
  return -1
}
var assocIndexOf_default = assocIndexOf

// dts/src/.internal/ListCache.ts
var ListCache = class {
  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  constructor(entries) {
    let index = -1
    const length = entries == null ? 0 : entries.length
    this.clear()
    while (++index < length) {
      const entry = entries[index]
      this.set(entry[0], entry[1])
    }
  }
  /**
   * Removes all key-value entries from the list cache.
   *
   * @memberOf ListCache
   */
  clear() {
    this.__data__ = []
    this.size = 0
  }
  /**
   * Removes `key` and its value from the list cache.
   *
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  delete(key) {
    const data = this.__data__
    const index = assocIndexOf_default(data, key)
    if (index < 0) {
      return false
    }
    const lastIndex = data.length - 1
    if (index === lastIndex) {
      data.pop()
    } else {
      data.splice(index, 1)
    }
    --this.size
    return true
  }
  /**
   * Gets the list cache value for `key`.
   *
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  get(key) {
    const data = this.__data__
    const index = assocIndexOf_default(data, key)
    return index < 0 ? void 0 : data[index][1]
  }
  /**
   * Checks if a list cache value for `key` exists.
   *
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  has(key) {
    return assocIndexOf_default(this.__data__, key) > -1
  }
  /**
   * Sets the list cache `key` to `value`.
   *
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  set(key, value) {
    const data = this.__data__
    const index = assocIndexOf_default(data, key)
    if (index < 0) {
      ++this.size
      data.push([key, value])
    } else {
      data[index][1] = value
    }
    return this
  }
}
var ListCache_default = ListCache

// dts/src/.internal/Hash.ts
var HASH_UNDEFINED = '__lodash_hash_undefined__'
var Hash = class {
  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  constructor(entries) {
    let index = -1
    const length = entries == null ? 0 : entries.length
    this.clear()
    while (++index < length) {
      const entry = entries[index]
      this.set(entry[0], entry[1])
    }
  }
  /**
   * Removes all key-value entries from the hash.
   *
   * @memberOf Hash
   */
  clear() {
    this.__data__ = /* @__PURE__ */ Object.create(null)
    this.size = 0
  }
  /**
   * Removes `key` and its value from the hash.
   *
   * @memberOf Hash
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  delete(key) {
    const result = this.has(key) && delete this.__data__[key]
    this.size -= result ? 1 : 0
    return result
  }
  /**
   * Gets the hash value for `key`.
   *
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  get(key) {
    const data = this.__data__
    const result = data[key]
    return result === HASH_UNDEFINED ? void 0 : result
  }
  /**
   * Checks if a hash value for `key` exists.
   *
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  has(key) {
    const data = this.__data__
    return data[key] !== void 0
  }
  /**
   * Sets the hash `key` to `value`.
   *
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  set(key, value) {
    const data = this.__data__
    this.size += this.has(key) ? 0 : 1
    data[key] = value === void 0 ? HASH_UNDEFINED : value
    return this
  }
}
var Hash_default = Hash

// dts/src/.internal/MapCache.ts
function getMapData({ __data__ }, key) {
  const data = __data__
  return isKeyable(key) ? data[typeof key === 'string' ? 'string' : 'hash'] : data.map
}
function isKeyable(value) {
  const type = typeof value
  return type === 'string' || type === 'number' || type === 'symbol' || type === 'boolean'
    ? value !== '__proto__'
    : value === null
}
var MapCache = class {
  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  constructor(entries) {
    let index = -1
    const length = entries == null ? 0 : entries.length
    this.clear()
    while (++index < length) {
      const entry = entries[index]
      this.set(entry[0], entry[1])
    }
  }
  /**
   * Removes all key-value entries from the map.
   *
   * @memberOf MapCache
   */
  clear() {
    this.size = 0
    this.__data__ = {
      hash: new Hash_default(),
      map: /* @__PURE__ */ new Map(),
      string: new Hash_default(),
    }
  }
  /**
   * Removes `key` and its value from the map.
   *
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  delete(key) {
    const result = getMapData(this, key)['delete'](key)
    this.size -= result ? 1 : 0
    return result
  }
  /**
   * Gets the map value for `key`.
   *
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  get(key) {
    return getMapData(this, key).get(key)
  }
  /**
   * Checks if a map value for `key` exists.
   *
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  has(key) {
    return getMapData(this, key).has(key)
  }
  /**
   * Sets the map `key` to `value`.
   *
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  set(key, value) {
    const data = getMapData(this, key)
    const size = data.size
    data.set(key, value)
    this.size += data.size === size ? 0 : 1
    return this
  }
}
var MapCache_default = MapCache

// dts/src/.internal/Stack.ts
var LARGE_ARRAY_SIZE = 200
var Stack = class {
  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  constructor(entries) {
    const data = (this.__data__ = new ListCache_default(entries))
    this.size = data.size
  }
  /**
   * Removes all key-value entries from the stack.
   *
   * @memberOf Stack
   */
  clear() {
    this.__data__ = new ListCache_default()
    this.size = 0
  }
  /**
   * Removes `key` and its value from the stack.
   *
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  delete(key) {
    const data = this.__data__
    const result = data['delete'](key)
    this.size = data.size
    return result
  }
  /**
   * Gets the stack value for `key`.
   *
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  get(key) {
    return this.__data__.get(key)
  }
  /**
   * Checks if a stack value for `key` exists.
   *
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  has(key) {
    return this.__data__.has(key)
  }
  /**
   * Sets the stack `key` to `value`.
   *
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  set(key, value) {
    let data = this.__data__
    if (data instanceof ListCache_default) {
      const pairs = data.__data__
      if (pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value])
        this.size = ++data.size
        return this
      }
      data = this.__data__ = new MapCache_default(pairs)
    }
    data.set(key, value)
    this.size = data.size
    return this
  }
}
var Stack_default = Stack

// dts/src/.internal/arrayEach.ts
function arrayEach(array, iteratee) {
  let index = -1
  const length = array.length
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break
    }
  }
  return array
}
var arrayEach_default = arrayEach

// dts/src/.internal/baseAssignValue.ts
function baseAssignValue(object, key, value) {
  if (key === '__proto__') {
    Object.defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      value: value,
      writable: true,
    })
  } else {
    object[key] = value
  }
}
var baseAssignValue_default = baseAssignValue

// dts/src/.internal/assignValue.ts
var hasOwnProperty = Object.prototype.hasOwnProperty
function assignValue(object, key, value) {
  const objValue = object[key]
  if (!(hasOwnProperty.call(object, key) && eq_default(objValue, value))) {
    if (value !== 0 || 1 / value === 1 / objValue) {
      baseAssignValue_default(object, key, value)
    }
  } else if (value === void 0 && !(key in object)) {
    baseAssignValue_default(object, key, value)
  }
}
var assignValue_default = assignValue

// dts/src/.internal/freeGlobal.ts
var freeGlobal = typeof global === 'object' && global !== null && global.Object === Object && global
var freeGlobal_default = freeGlobal

// dts/src/.internal/root.ts
var freeGlobalThis =
  typeof globalThis === 'object' &&
  globalThis !== null &&
  globalThis.Object === Object &&
  globalThis
var freeSelf = typeof self === 'object' && self !== null && self.Object === Object && self
var root = freeGlobalThis || freeGlobal_default || freeSelf || Function('return this')()
var root_default = root

// dts/src/.internal/cloneBuffer.ts
var freeExports = typeof exports === 'object' && exports !== null && !exports.nodeType && exports
var freeModule =
  freeExports && typeof module === 'object' && module !== null && !module.nodeType && module
var moduleExports = freeModule && freeModule.exports === freeExports
var Buffer = moduleExports ? root_default.Buffer : void 0
var allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice()
  }
  const length = buffer.length
  const result = allocUnsafe ? allocUnsafe(length) : buffer.constructor.alloc(length)
  buffer.copy(result)
  return result
}
var cloneBuffer_default = cloneBuffer

// dts/src/.internal/copyArray.ts
function copyArray(source, array) {
  let index = -1
  const length = source.length
  array || (array = new Array(length))
  while (++index < length) {
    array[index] = source[index]
  }
  return array
}
var copyArray_default = copyArray

// dts/src/.internal/copyObject.ts
function copyObject(source, props, object, customizer) {
  const isNew = !object
  object || (object = {})
  for (const key of props) {
    let newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0
    if (newValue === void 0) {
      newValue = source[key]
    }
    if (isNew) {
      baseAssignValue_default(object, key, newValue)
    } else {
      assignValue_default(object, key, newValue)
    }
  }
  return object
}
var copyObject_default = copyObject

// dts/src/.internal/cloneArrayBuffer.ts
function cloneArrayBuffer(arrayBuffer) {
  const result = new arrayBuffer.constructor(arrayBuffer.byteLength)
  new Uint8Array(result).set(new Uint8Array(arrayBuffer))
  return result
}
var cloneArrayBuffer_default = cloneArrayBuffer

// dts/src/.internal/cloneDataView.ts
function cloneDataView(dataView, isDeep) {
  const buffer = isDeep ? cloneArrayBuffer_default(dataView.buffer) : dataView.buffer
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength)
}
var cloneDataView_default = cloneDataView

// dts/src/.internal/cloneRegExp.ts
var reFlags = /\w*$/
function cloneRegExp(regexp) {
  const result = new regexp.constructor(regexp.source, reFlags.exec(regexp))
  result.lastIndex = regexp.lastIndex
  return result
}
var cloneRegExp_default = cloneRegExp

// dts/src/.internal/cloneSymbol.ts
var symbolValueOf = Symbol.prototype.valueOf
function cloneSymbol(symbol) {
  return Object(symbolValueOf.call(symbol))
}
var cloneSymbol_default = cloneSymbol

// dts/src/.internal/cloneTypedArray.ts
function cloneTypedArray(typedArray, isDeep) {
  const buffer = isDeep ? cloneArrayBuffer_default(typedArray.buffer) : typedArray.buffer
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length)
}
var cloneTypedArray_default = cloneTypedArray

// dts/src/.internal/getSymbols.ts
var propertyIsEnumerable = Object.prototype.propertyIsEnumerable
var nativeGetSymbols = Object.getOwnPropertySymbols
function getSymbols(object) {
  if (object == null) {
    return []
  }
  object = Object(object)
  return nativeGetSymbols(object).filter((symbol) => propertyIsEnumerable.call(object, symbol))
}
var getSymbols_default = getSymbols

// dts/src/.internal/copySymbols.ts
function copySymbols(source, object) {
  return copyObject_default(source, getSymbols_default(source), object)
}
var copySymbols_default = copySymbols

// dts/src/.internal/getSymbolsIn.ts
function getSymbolsIn(object) {
  const result = []
  while (object) {
    result.push(...getSymbols_default(object))
    object = Object.getPrototypeOf(Object(object))
  }
  return result
}
var getSymbolsIn_default = getSymbolsIn

// dts/src/.internal/copySymbolsIn.ts
function copySymbolsIn(source, object) {
  return copyObject_default(source, getSymbolsIn_default(source), object)
}
var copySymbolsIn_default = copySymbolsIn

// dts/src/.internal/getTag.ts
var toString = Object.prototype.toString
function getTag(value) {
  if (value == null) {
    return value === void 0 ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}
var getTag_default = getTag

// dts/src/isObjectLike.ts
function isObjectLike(value) {
  return typeof value === 'object' && value !== null
}
var isObjectLike_default = isObjectLike

// dts/src/isArguments.ts
function isArguments(value) {
  return isObjectLike_default(value) && getTag_default(value) === '[object Arguments]'
}
var isArguments_default = isArguments

// dts/src/isBuffer.ts
var nativeIsBuffer = root_default?.Buffer?.isBuffer
var isBuffer = typeof nativeIsBuffer === 'function' ? nativeIsBuffer : () => false
var isBuffer_default = isBuffer

// dts/src/.internal/isIndex.ts
var MAX_SAFE_INTEGER = 9007199254740991
var reIsUint = /^(?:0|[1-9]\d*)$/
function isIndex(value, length) {
  const type = typeof value
  length = length == null ? MAX_SAFE_INTEGER : length
  return (
    !!length &&
    (type === 'number' || (type !== 'symbol' && reIsUint.test(value))) &&
    value > -1 &&
    value % 1 === 0 &&
    value < length
  )
}
var isIndex_default = isIndex

// dts/src/.internal/nodeTypes.ts
var freeExports2 = typeof exports === 'object' && exports !== null && !exports.nodeType && exports
var freeModule2 =
  freeExports2 && typeof module === 'object' && module !== null && !module.nodeType && module
var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2
var freeProcess = moduleExports2 && freeGlobal_default.process
var nodeTypes = (() => {
  try {
    const typesHelper = freeModule2 && freeModule2.require && freeModule2.require('util').types
    return typesHelper
      ? typesHelper
      : freeProcess && freeProcess.binding && freeProcess.binding('util')
  } catch (e) {}
})()
var nodeTypes_default = nodeTypes

// dts/src/isTypedArray.ts
var reTypedTag = /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array\]$/
var nodeIsTypedArray = nodeTypes_default && nodeTypes_default.isTypedArray
var isTypedArray = nodeIsTypedArray
  ? (value) => nodeIsTypedArray(value)
  : (value) => isObjectLike_default(value) && reTypedTag.test(getTag_default(value))
var isTypedArray_default = isTypedArray

// dts/src/.internal/arrayLikeKeys.ts
var hasOwnProperty2 = Object.prototype.hasOwnProperty
function arrayLikeKeys(value, inherited) {
  const isArr = Array.isArray(value)
  const isArg = !isArr && isArguments_default(value)
  const isBuff = !isArr && !isArg && isBuffer_default(value)
  const isType = !isArr && !isArg && !isBuff && isTypedArray_default(value)
  const skipIndexes = isArr || isArg || isBuff || isType
  const length = value.length
  const result = new Array(skipIndexes ? length : 0)
  let index = skipIndexes ? -1 : length
  while (++index < length) {
    result[index] = `${index}`
  }
  for (const key in value) {
    if (
      (inherited || hasOwnProperty2.call(value, key)) &&
      !(
        skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key === 'length' || // Skip index properties.
          isIndex_default(key, length))
      )
    ) {
      result.push(key)
    }
  }
  return result
}
var arrayLikeKeys_default = arrayLikeKeys

// dts/src/isLength.ts
var MAX_SAFE_INTEGER2 = 9007199254740991
function isLength(value) {
  return typeof value === 'number' && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER2
}
var isLength_default = isLength

// dts/src/isArrayLike.ts
function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength_default(value.length)
}
var isArrayLike_default = isArrayLike

// dts/src/keys.ts
function keys(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object) : Object.keys(Object(object))
}
var keys_default = keys

// dts/src/.internal/getAllKeys.ts
function getAllKeys(object) {
  const result = keys_default(object)
  if (!Array.isArray(object)) {
    result.push(...getSymbols_default(object))
  }
  return result
}
var getAllKeys_default = getAllKeys

// dts/src/.internal/getAllKeysIn.ts
function getAllKeysIn(object) {
  const result = []
  for (const key in object) {
    result.push(key)
  }
  if (!Array.isArray(object)) {
    result.push(...getSymbolsIn_default(object))
  }
  return result
}
var getAllKeysIn_default = getAllKeysIn

// dts/src/.internal/isPrototype.ts
var objectProto = Object.prototype
function isPrototype(value) {
  const Ctor = value && value.constructor
  const proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto
  return value === proto
}
var isPrototype_default = isPrototype

// dts/src/.internal/initCloneObject.ts
function initCloneObject(object) {
  return typeof object.constructor === 'function' && !isPrototype_default(object)
    ? Object.create(Object.getPrototypeOf(object))
    : {}
}
var initCloneObject_default = initCloneObject

// dts/src/isObject.ts
function isObject(value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}
var isObject_default = isObject

// dts/src/keysIn.ts
function keysIn(object) {
  const result = []
  for (const key in object) {
    result.push(key)
  }
  return result
}
var keysIn_default = keysIn

// dts/src/.internal/baseClone.ts
var CLONE_DEEP_FLAG = 1
var CLONE_FLAT_FLAG = 2
var CLONE_SYMBOLS_FLAG = 4
var argsTag = '[object Arguments]'
var arrayTag = '[object Array]'
var boolTag = '[object Boolean]'
var dateTag = '[object Date]'
var errorTag = '[object Error]'
var mapTag = '[object Map]'
var numberTag = '[object Number]'
var objectTag = '[object Object]'
var regexpTag = '[object RegExp]'
var setTag = '[object Set]'
var stringTag = '[object String]'
var symbolTag = '[object Symbol]'
var weakMapTag = '[object WeakMap]'
var arrayBufferTag = '[object ArrayBuffer]'
var dataViewTag = '[object DataView]'
var float32Tag = '[object Float32Array]'
var float64Tag = '[object Float64Array]'
var int8Tag = '[object Int8Array]'
var int16Tag = '[object Int16Array]'
var int32Tag = '[object Int32Array]'
var uint8Tag = '[object Uint8Array]'
var uint8ClampedTag = '[object Uint8ClampedArray]'
var uint16Tag = '[object Uint16Array]'
var uint32Tag = '[object Uint32Array]'
var cloneableTags = {}
cloneableTags[argsTag] =
  cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] =
  cloneableTags[dataViewTag] =
  cloneableTags[boolTag] =
  cloneableTags[dateTag] =
  cloneableTags[float32Tag] =
  cloneableTags[float64Tag] =
  cloneableTags[int8Tag] =
  cloneableTags[int16Tag] =
  cloneableTags[int32Tag] =
  cloneableTags[mapTag] =
  cloneableTags[numberTag] =
  cloneableTags[objectTag] =
  cloneableTags[regexpTag] =
  cloneableTags[setTag] =
  cloneableTags[stringTag] =
  cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] =
  cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] =
  cloneableTags[uint32Tag] =
    true
cloneableTags[errorTag] = cloneableTags[weakMapTag] = false
var hasOwnProperty3 = Object.prototype.hasOwnProperty
function initCloneByTag(object, tag, isDeep) {
  const Ctor = object.constructor
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer_default(object)
    case boolTag:
    case dateTag:
      return new Ctor(+object)
    case dataViewTag:
      return cloneDataView_default(object, isDeep)
    case float32Tag:
    case float64Tag:
    case int8Tag:
    case int16Tag:
    case int32Tag:
    case uint8Tag:
    case uint8ClampedTag:
    case uint16Tag:
    case uint32Tag:
      return cloneTypedArray_default(object, isDeep)
    case mapTag:
      return new Ctor()
    case numberTag:
    case stringTag:
      return new Ctor(object)
    case regexpTag:
      return cloneRegExp_default(object)
    case setTag:
      return new Ctor()
    case symbolTag:
      return cloneSymbol_default(object)
  }
}
function initCloneArray(array) {
  const { length } = array
  const result = new array.constructor(length)
  if (length && typeof array[0] === 'string' && hasOwnProperty3.call(array, 'index')) {
    result.index = array.index
    result.input = array.input
  }
  return result
}
function baseClone(value, bitmask, customizer, key, object, stack) {
  let result
  const isDeep = bitmask & CLONE_DEEP_FLAG
  const isFlat = bitmask & CLONE_FLAT_FLAG
  const isFull = bitmask & CLONE_SYMBOLS_FLAG
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value)
  }
  if (result !== void 0) {
    return result
  }
  if (!isObject_default(value)) {
    return value
  }
  const isArr = Array.isArray(value)
  const tag = getTag_default(value)
  if (isArr) {
    result = initCloneArray(value)
    if (!isDeep) {
      return copyArray_default(value, result)
    }
  } else {
    const isFunc = typeof value === 'function'
    if (isBuffer_default(value)) {
      return cloneBuffer_default(value, isDeep)
    }
    if (tag === objectTag || tag === argsTag || (isFunc && !object)) {
      result = isFlat || isFunc ? {} : initCloneObject_default(value)
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn_default(value, copyObject_default(value, keysIn_default(value), result))
          : copySymbols_default(value, Object.assign(result, value))
      }
    } else {
      if (isFunc || !cloneableTags[tag]) {
        return object ? value : {}
      }
      result = initCloneByTag(value, tag, isDeep)
    }
  }
  stack || (stack = new Stack_default())
  const stacked = stack.get(value)
  if (stacked) {
    return stacked
  }
  stack.set(value, result)
  if (tag === mapTag) {
    value.forEach((subValue, key2) => {
      result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack))
    })
    return result
  }
  if (tag === setTag) {
    value.forEach((subValue) => {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack))
    })
    return result
  }
  if (isTypedArray_default(value)) {
    return result
  }
  const keysFunc = isFull
    ? isFlat
      ? getAllKeysIn_default
      : getAllKeys_default
    : isFlat
    ? keysIn_default
    : keys_default
  const props = isArr ? void 0 : keysFunc(value)
  arrayEach_default(props || value, (subValue, key2) => {
    if (props) {
      key2 = subValue
      subValue = value[key2]
    }
    assignValue_default(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack))
  })
  return result
}
var baseClone_default = baseClone
export { baseClone_default as default }

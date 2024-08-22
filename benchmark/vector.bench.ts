import { Vec } from '@chzky/fp'
import { assert } from '@std/assert/mod.ts'

Deno.bench('bench-Vec', ({ start, end }) => {
  const name_r = ['jio', 'jiojio', 'dio', 'diojio']
  const address = ['防抖华云', '公园花园', '秀琼花园']
  const arr = Array.from({ length: 100000 }, (_, i) => ({
    name: name_r[i % name_r.length],
    id: i,
    address: address[i % address.length],
    is: false,
  }))

  start()
  Vec(arr)
    .map((i) => {
      if (i.id % 2 === 0) i.is = true
      return i
    })
    .filter((i) => i.name == 'dio')
    .filter((i) => i.is)
    .drop(10)
    .map((i) => ({ ...i, name: i.address + '-' + i.name }))
    .take(500) /* KEY */
    .collect()
  end()
})

Deno.bench('bench-origin', ({ start, end }) => {
  const name_r = ['jio', 'jiojio', 'dio', 'diojio']
  const address = ['防抖华云', '公园花园', '秀琼花园']
  const arr = Array.from({ length: 100000 }, (_, i) => ({
    name: name_r[i % name_r.length],
    id: i,
    address: address[i % address.length],
    is: false,
  }))

  let res = []
  start()
  for (const item of arr) {
    if (item.id % 2 === 0) item.is = true
    if (item.name == 'dio' && item.is) {
      res.push({ ...item, name: item.address + '-' + item.name })
    }
  }
  res = res.slice(10, 500)
  end()
})

Deno.bench('bench-array', ({ start, end }) => {
  const name_r = ['jio', 'jiojio', 'dio', 'diojio']
  const address = ['防抖华云', '公园花园', '秀琼花园']
  const arr = Array.from({ length: 100000 }, (_, i) => ({
    name: name_r[i % name_r.length],
    id: i,
    address: address[i % address.length],
    is: false,
  }))

  start()
  arr
    .map((i) => {
      if (i.id % 2 === 0) i.is = true
      return i
    })
    .filter((i) => i.name == 'dio')
    .filter((i) => i.is)
    .slice(10)
    .map((i) => ({ ...i, name: i.address + '-' + i.name }))
    .slice(500)
  end()
})

Deno.bench('Vec-pagination', ({ start, end }) => {
  const name_r = ['jio', 'jiojio', 'dio', 'diojio']
  const address = ['防抖华云', '公园花园', '秀琼花园']
  const arr = Array.from({ length: 100000 }, (_, i) => ({
    name: name_r[i % name_r.length],
    id: i,
    address: address[i % address.length],
    is: false,
  }))

  // 取 name ==='jiojio' && address==='公园花园' 的数据并进行分页处理
  const res = Vec(arr)
    .filter((i) => i.name === 'jiojio')
    .filter((i) => i.address === '公园花园')
    .drop(500)
    .take(15)
    .collect()
  start()
  end()

  assert(res.length === 15)
})

Deno.bench('arr-pagination', ({ start, end }) => {
  const name_r = ['jio', 'jiojio', 'dio', 'diojio']
  const address = ['防抖华云', '公园花园', '秀琼花园']

  const arr = Array.from({ length: 100000 }, (_, i) => ({
    name: name_r[i % name_r.length],
    id: i,
    address: address[i % address.length],
    is: false,
  }))

  start()

  const res = arr
    .filter((i) => i.name === 'jiojio')
    .filter((i) => i.address === '公园花园')
    .slice(500, 515) // 1.27 ms/iter
  end()
  assert(res.length === 15)
})

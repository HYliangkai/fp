/**
[immer文档](https://immerjs.github.io/immer/zh-CN/)
immer是一个不可变数据库,能够将数据隔离,避免数据被修改,同时能够提高性能

  使用场景 :
  1. 大数据量的数据处理
  2. 数据深拷贝

@category ext
 */

export {
  produce,
  enableMapSet,
  enablePatches,
  castImmutable,
  createDraft,
  finishDraft,
  type Draft,
  type Immutable,
} from 'npm:immer@10.0.3'

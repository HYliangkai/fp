/* 读取注释中的todo语句  默认读取已到期todo  | --all 读取所有todo */

import { Block, parse } from 'npm:comment-parser'
import pack from '../deno.json' with { type: 'json' }
import { dayjs, flow, None, Ok, pipe, Some } from '@chzky/fp'
import { output_todo, print_todo, todo } from './todo.ts'
import { join } from '@std/path/join.ts'

type File = { name: string; full: string; kids: FileTree; type: 'file' | 'dir' }
type FileTree = Array<File>

const TARGET_TAG = 'todo'
const VERSION_TAG = 'version'
const DESC_TAG = 'desc'

const PATH = [join(import.meta.dirname!, '../lib'),join(import.meta.dirname!, '../src')]
const NOW_VERSION = (pack.version || '0.0.0').split('.')
const READ_ALL = Deno.args[0] === '--all'

function has_target_tag(block: Block[]) {
  return block.some((item) => item.tags.some((tag) => tag.tag === TARGET_TAG))
}

async function read_dir(
  path: string,
  tree: Array<any> = [],
  file_tree: Array<any> = [],
) {
  for await (const dir of Deno.readDir(path)) {
    const ret = { name: dir.name, full: join(path, dir.name), kids: [] }
    if (dir.isDirectory) {
      tree.push({ ...ret, type: 'dir' })
      await read_dir(join(path, dir.name), ret.kids, file_tree)
    } else if (dir.isFile) {
      const conf = { ...ret, type: 'file' }
      tree.push(conf)
      file_tree.push(conf)
    }
  }
  return [tree, file_tree] as [FileTree, FileTree & Array<{ type: 'file' }>]
}

async function find_target_tag_file(val: [unknown, FileTree]) {
  const [_, file_tree] = val
  return (await Promise.all(
    file_tree
      .filter((file) => file.name.endsWith('.ts'))
      .map((file) =>
        pipe.async(
          file.full,
          Deno.readTextFile,
          parse,
          has_target_tag,
          (has) => (has ? file : null),
        )
      ),
  )).filter(Boolean) as Array<File>
}

async function inject_todo(files: Array<File>) {
  await Promise.all(files.map(async (file) => {
    ;(await pipe.async(
      file.full,
      Deno.readTextFile,
      parse,
    ))
      .filter((i) => has_target_tag([i]))
      .forEach((block) => {
        const format = (block: Block, tag: string) => {
          const target = block.tags.find((i) => i.tag == tag)
          return target ? Some(target.name + ' ' + target.description) : None
        }

        const title = format(block, TARGET_TAG).unwrap()
        const desc = format(block, DESC_TAG)
        const version = format(block, VERSION_TAG)
        todo({
          title,
          desc,
          matur_version: version,
          stack: Some(file.full),
          matur_day: None,
        })
      })
  }))
  return Ok()
}

const read_path_todo = flow(read_dir, find_target_tag_file, inject_todo)
await Promise.all(PATH.map(read_path_todo))



const filter_list = output_todo().filter(({ matur_day, matur_version }) => {
  if (READ_ALL) return true
  if (matur_day.is_some && dayjs(matur_day.unwrap()).isBefore(dayjs())) {
    return true
  }
  if (matur_version.is_some) {
    const [major, minor, patch] = matur_version.unwrap().split('.').map((
      item,
    ) => parseInt(item))
    const version_num = major * 10000 + minor * 100 + patch
    const [now_major, now_minor, now_patch] = NOW_VERSION.map((item) =>
      parseInt(item)
    )
    const now_version_num = now_major * 10000 + now_minor * 100 + now_patch
    if (version_num <= now_version_num) return true
  }
  return false
})

const exit_code = filter_list.length > 0 ? 1 : 0

if (exit_code) {
  console.log('\n%c当前项目有未完成的待办事项:\n', 'color:#F56C6C')
  print_todo(filter_list)
  Deno.exit(exit_code)
}

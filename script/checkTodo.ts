import pack from '../deno.json' with { type: 'json' }
import { output_todo, print_todo } from 'lib'
import { dayjs } from '../mod.ts'

const now_version = (pack.version || '0.0.0').split('.')

const filter_list = output_todo().filter(({ matur_day, matur_version }) => {
  if (matur_day !== undefined && dayjs(matur_day).isBefore(dayjs())) {
    return true
  }
  if (matur_version !== undefined) {
    const [major, minor, patch] = matur_version.split('.').map((item) => parseInt(item))
    const version_num = major * 10000 + minor * 100 + patch
    const [now_major, now_minor, now_patch] = now_version.map((item) => parseInt(item))
    const now_version_num = now_major * 10000 + now_minor * 100 + now_patch
    if (version_num <= now_version_num) return true
  }
  return false
})

const exit_code = filter_list.length > 0 ? 1 : 0

if (exit_code) {
  console.log('%c当前项目有未完成的待办事项,无法提交代码:', 'color:#F56C6C')
  print_todo(filter_list)
  Deno.exit(exit_code)
}



import { None, Option, Some } from 'npm:@chzky/fp@0.7.8'

type TodoObjOption = {
  title: string
  desc: Option<string>
  matur_day: Option<string>
  matur_version: Option<string>
  stack: Option<string>
}
type TodoOption = string | TodoObjOption
type TodoList = Array<TodoObjOption>
const STACK_POSITION = 3 as const
const TODO_LIST: TodoList = []

function call_stack(): string {
  try {
    throw new Error('TODO')
  } catch (e) {
    return (
      e.stack
        .split('\n')
        .at(STACK_POSITION || 3)
        .trim() || undefined
    )
  }
}

export const todo = (todo_option: TodoOption, matur_ver?: string): void => {
  if (typeof todo_option === 'string') {
    TODO_LIST.push({
      stack: None,
      title: todo_option,
      matur_version: Some(matur_ver!),
      desc: None,
      matur_day: None,
    })
  } else {
    const { title, desc = None, matur_day = None, matur_version = None, stack = None } = todo_option
    TODO_LIST.push({
      stack,
      title,
      desc,
      matur_day,
      matur_version: matur_version || matur_ver,
    })
  }
}

export const print_todo = (list = TODO_LIST): void => {
  list.forEach(({ title, desc, stack, matur_day, matur_version }) => {
    const fmstr =
      `%cTODO : %c${title}` +
      `%c${desc.is_none ? '' : `\n       ${desc.unwarp()}`}` +
      `%c${stack.is_none ? '' : `\n       ${stack.unwarp()}`}` +
      `%c${matur_day.is_none ? '' : `\n       ${matur_day.unwarp()}`}` +
      `${matur_version.is_none ? '' : `\n       V${matur_version.unwarp()}`}`
    console.log(fmstr, 'color:#67C23A', 'color:#409EFF', 'color:#fff', 'color:#E6A23C;', 'color:#909399')
    console.log(`--------------------------------------------`)
  })
}

export const output_todo = (): TodoList => TODO_LIST

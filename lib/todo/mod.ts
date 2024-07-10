type TodoObjOption = { title: string; desc?: string; matur_day?: string; matur_version?: string }
type TodoOption = string | TodoObjOption
type TodoList = Array<TodoObjOption & { stack: string }>

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
  const stack = call_stack()
  if (typeof todo_option === 'string') {
    TODO_LIST.push({ stack, title: todo_option, matur_version: matur_ver })
  } else {
    const { title, desc = undefined, matur_day = undefined, matur_version = undefined } = todo_option
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
      `%c${desc === undefined ? '' : `\n       ${desc}`}` +
      `%c${stack === undefined ? '' : `\n       ${stack}`}` +
      `%c${matur_day === undefined ? '' : `\n       ${matur_day}`}` +
      `${matur_version === undefined ? '' : `\n       V${matur_version}`}`
    console.log(fmstr, 'color:#67C23A', 'color:#409EFF', 'color:#fff', 'color:#E6A23C;', 'color:#909399')
    console.log(`--------------------------------------------`)
  })
}

export const output_todo = (): TodoList => TODO_LIST

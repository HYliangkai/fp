import {Err, Ok, Option, Result, option} from 'lib'
type Path = {__dirname: Option<string>; __filename: Option<string>}
const path = (): Result<Path, string> => {
  const url = new URL(import.meta.url)
  if (url.protocol === 'file:') {
    return Ok({
      __dirname: option(url.pathname.split('/').slice(0, -1).join('/')),
      __filename: option(url.pathname.split('/').at(-1)),
    })
  } else {
    return Err('No Local documents')
  }
}
const {__dirname, __filename} = path().unwarp()

export const sleep = (time = 1000, random = false) =>
  new Promise(resolve => {
    setTimeout(resolve, random ? Math.floor(Math.random() * time) : time)
  })

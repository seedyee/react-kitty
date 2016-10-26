import fs from 'fs'
import notifier from 'node-notifier'

function createNotification(options = {}) {
  notifier.notify({
    title: options.title,
    message: options.message,
    open: options.open,
  })

  console.log(`${options.title}: ${options.message}`)
}

export function ifElse(condition) {
  return (then, otherwise) => (condition ? then : otherwise)
}

export function removeEmpty(array) {
  return array.filter((entry) => !!entry)
}

export function removeEmptyKeys(obj) {
  const copy = {}
  for (const key in obj) { // eslint-disable-line
    if (!(obj[key] == null || obj[key].length === 0)) {
      copy[key] = obj[key]
    }
  }

  return copy
}

export function merge() {
  const funcArgs = Array.prototype.slice.call(arguments) // eslint-disable-line prefer-rest-params

  return Object.assign.apply(
    null,
    removeEmpty([{}].concat(funcArgs))
  )
}

export function ifIsFile(filePath) {
  try {
    return fs.statSync(filePath).isFile() ? filePath : ''
  } catch (ex) {
    /* console.log(ex)*/
  }
  return ''
}

export {
  createNotification,
}

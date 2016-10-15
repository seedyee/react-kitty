export function notEmpty(x, message) { // eslint-disable-line
  if (x == null) {
    throw new Error(message)
  }

  return x
}

const suffixes = ['REQUEST', 'SUCCES', 'FAILURE']
export const createActionTypes = (prefix, name) => {
  const acc = {}
  suffixes.forEach(s => {
    acc[s] = `${prefix}/${name}_${s}`
  })
  return acc
}

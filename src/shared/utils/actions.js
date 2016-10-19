const suffixes = ['REQUEST', 'SUCCESS', 'FAILURE']
export const createActionTypes = (prefix, name) => {
  const acc = {}
  suffixes.forEach(s => {
    acc[s] = `${prefix}/${name}_${s}`
  })
  return acc
}

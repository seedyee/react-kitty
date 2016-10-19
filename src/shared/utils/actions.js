const suffixes = ['REQUEST', 'SUCCESS', 'FAILURE']
export const createActionTypes = (prefix, name) => {
  const actionName = name || prefix
  const acc = {}
  suffixes.forEach(s => {
    acc[s] = `${prefix}/${actionName}_${s}`
  })
  return acc
}

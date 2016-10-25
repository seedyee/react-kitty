const status = ['REQUEST', 'SUCCESS', 'FAILURE']
const defaultActionCrator = (type) => (payload, meta = {}) => {
  if (typeof payload === 'undefined') {
    return { type, ...meta }
  }
  return { type, payload, ...meta }
}

const checker = (str) => {
  if (!typeof str === 'string' && str.length > 0) {
    throw new Error(`createActionTypes' first argument or second argument(if provided) can't be ${str}, must be a not empty string !`)
  }
}

export const createActions = (prefix, name = prefix, actionCreator = defaultActionCrator) => {
  checker(prefix)
  checker(name)
  const actions = {}
  status.forEach(s => {
    actions[s] = `${prefix}/${name}_${s}`
    actions[s.toLowerCase()] = actionCreator(actions[s])
  })
  return actions
}

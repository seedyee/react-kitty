import { HELLO } from './actions'

const initState = {
  message: 'user',
}

export default (state = initState, action) => {
  switch (action.type) {
    case HELLO:
      return { ...state, message: action.payload }
    default:
      return state
  }
}

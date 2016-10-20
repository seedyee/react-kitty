import immutable from 'immutable'
import { loginActionTypes, logoutActionTypes, registerActionTypes } from './actions'

const initialAuthState = immutable.fromJS({ logined: false, user: {} })
const auth = (state = initialAuthState, action) => {
  switch (action.type) {
    case loginActionTypes.SUCCESS:
      return state.set('user', action.payload).set('logined', true)
    case logoutActionTypes.SUCCESS:
      return state.remove('user').set('logined', false)
    case registerActionTypes.SUCCESS:
      return state.set('user', action.payload).set('logined', true)
    default:
      return state
  }
}

export default auth


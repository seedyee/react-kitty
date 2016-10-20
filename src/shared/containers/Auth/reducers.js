import immutable from 'immutable'
import { loginActionTypes, logoutActionTypes } from './actions'

const initialAuthState = immutable.fromJS({ logined: false, user: {} })
const auth = (state = initialAuthState, action) => {
  switch (action.type) {
    case loginActionTypes.SUCCESS:
      return state.set('user', action.payload).set('logined', true)
    case logoutActionTypes.SUCCESS:
      return state.remove('user').set('logined', false)
    default:
      return state
  }
}

export default auth


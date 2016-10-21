import immutable from 'immutable'
import { loginActions, logoutActions, registerActions } from './actions'

const initialAuthState = immutable.fromJS({ logined: false, user: {} })
const auth = (state = initialAuthState, action) => {
  switch (action.type) {
    case loginActions.SUCCESS:
      return state.set('user', action.payload).set('logined', true)
    case logoutActions.SUCCESS:
      return state.remove('user').set('logined', false)
    case registerActions.SUCCESS:
      return state.set('user', action.payload).set('logined', true)
    default:
      return state
  }
}

export default auth


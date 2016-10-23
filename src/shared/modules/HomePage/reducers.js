import { combineReducers } from 'redux-immutable'
import { fromJS } from 'immutable'

import { loadUsersActions } from './actions'

const users = (state = null, action) => {
  switch (action.type) {
    case loadUsersActions.SUCCESS:
      return fromJS(action.payload)
    default:
      return state
  }
}

export default combineReducers({
  users,
})


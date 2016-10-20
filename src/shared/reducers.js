/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { LOCATION_CHANGE } from 'react-router-redux'
import { fromJS } from 'immutable'
import { combineReducers } from 'redux-immutable'
import { reducer as formReducer } from 'redux-form/immutable'
import authReducer from './modules/Auth/reducers'

const routeInitialState = fromJS({
  locationBeforeTransitions: null,
})

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  if (action.type === LOCATION_CHANGE) {
    return state.merge({
      locationBeforeTransitions: action.payload,
    })
  }

  return state
}
export default combineReducers({
  routing: routeReducer,
  form: formReducer,
  auth: authReducer,
})

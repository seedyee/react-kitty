/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux-immutable'
import { reducer as formReducer } from 'redux-form/immutable'
import authReducer from './modules/Auth/reducers'

export default combineReducers({
  form: formReducer,
  auth: authReducer,
})

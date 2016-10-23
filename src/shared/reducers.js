/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux-immutable'
import { reducer as formReducers } from 'redux-form/immutable'
import authReducers from './modules/Auth/reducers'
import homeReducers from './modules/HomePage/reducers'

export default combineReducers({
  form: formReducers,
  auth: authReducers,
  home: homeReducers,
})

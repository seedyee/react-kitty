import { createAction } from 'redux-actions'
import { createActionTypes } from '../../utils/actions'

const prefix = 'LOGIN'
export const loginActionTypes = createActionTypes(prefix)
export const loginRequest = createAction(loginActionTypes.REQUEST)
export const loginSuccess = createAction(loginActionTypes.SUCCESS)
export const loginFailure = createAction(loginActionTypes.FAILURE)

import { createAction } from 'redux-actions'
import { createActionTypes } from '../../utils/actions'

const prefix = 'AUTH'

export const loginActionTypes = createActionTypes(prefix, 'LOGIN')
export const loginRequest = createAction(loginActionTypes.REQUEST)
export const loginSuccess = createAction(loginActionTypes.SUCCESS)
export const loginFailure = createAction(loginActionTypes.FAILURE)

export const logoutActionTypes = createActionTypes(prefix, 'LOGOUT')
export const logoutRequest = createAction(logoutActionTypes.REQUEST)
export const logoutSuccess = createAction(logoutActionTypes.SUCCESS)
export const logoutFailure = createAction(logoutActionTypes.FAILURE)


export const registerActionTypes = createActionTypes(prefix, 'REGISTER')
export const registerRequest = createAction(registerActionTypes.REQUEST)
export const registerSuccess = createAction(registerActionTypes.SUCCESS)
export const registerFailure = createAction(registerActionTypes.FAILURE)

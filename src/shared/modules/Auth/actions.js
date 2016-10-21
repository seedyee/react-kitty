import { createActionTypes } from '../../utils/actions'

const prefix = 'AUTH'

export const loginActions = createActionTypes(prefix, 'LOGIN')
export const logoutActions = createActionTypes(prefix, 'LOGOUT')
export const registerActions = createActionTypes(prefix, 'REGISTER')


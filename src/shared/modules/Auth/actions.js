import { createActions } from '../../utils/actions'

const prefix = 'AUTH'

export const loginActions = createActions(prefix, 'LOGIN')
export const logoutActions = createActions(prefix, 'LOGOUT')
export const registerActions = createActions(prefix, 'REGISTER')


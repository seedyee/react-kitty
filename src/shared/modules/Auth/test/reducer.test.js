/* eslint-disable no-param-reassign */
import test from 'ava'
import { Map } from 'immutable'
import authReducer from '../reducers'
import { loginActions, logoutActions, registerActions } from '../actions'

const payload = { payload: 'payload' }

const initialState = Map({ logined: false, user: {} })

test('should return the initial state', t => {
  t.deepEqual(authReducer(undefined, {}), initialState)
})

test('should handle login actions correctly', t => {
  const expectedSuccessResult = initialState.set('logined', true).set('user', payload)
  t.deepEqual(
    authReducer(undefined, loginActions.request()),
    initialState
  )
  t.deepEqual(
    authReducer(undefined, loginActions.success(payload)),
    expectedSuccessResult
  )
  t.deepEqual(
    authReducer(undefined, loginActions.failure()),
    initialState
  )
})

test('should handle loginout actions correctly', t => {
  const loginedState = authReducer(undefined, loginActions.success(payload))
  t.deepEqual(
    authReducer(loginedState, logoutActions.request()),
    loginedState
  )
  t.deepEqual(
    authReducer(loginedState, logoutActions.success()),
    initialState
  )
  t.deepEqual(
    authReducer(loginedState, logoutActions.failure()),
    loginedState
  )
})

test('should handle register actions correctly', t => {
  const expectedSuccessResult = initialState.set('logined', true).set('user', payload)
  t.deepEqual(
    authReducer(undefined, registerActions.request()),
    initialState
  )
  t.deepEqual(
    authReducer(undefined, registerActions.success(payload)),
    expectedSuccessResult
  )
  t.deepEqual(
    authReducer(undefined, registerActions.failure()),
    initialState
  )
})


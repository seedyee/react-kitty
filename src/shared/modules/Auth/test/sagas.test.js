import test from 'ava'
import { take, call, put } from 'redux-saga/effects'
import { loginFlow, logoutFlow, registerFlow } from '../sagas'
import { loginActions, logoutActions, registerActions } from '../actions'
import * as api from '../../../api'

const payload = { email: 'seedyee', password: 'abcdefg' }
const response = { email: 'seedyee@mail.com' }
const action = { type: 'TEST', payload }
const failureResponse = { error: { text: 'test' } }

// --------------------------------- login flow
test('login success condition', t => {
  // First we create the generator, it won't start until we call next()
  const gen = loginFlow()
 // We assert that the yield block indeed has the expected value
  t.deepEqual(
    gen.next().value,
    take(loginActions.REQUEST)
  )
  t.deepEqual(
    gen.next(action).value,
    call(api.login, payload)
  )
  t.deepEqual(
    gen.next(response).value,
    put(loginActions.success(response))
  )
  // Login flow  restart again
  t.deepEqual(
    gen.next().value,
    take(loginActions.REQUEST)
  )
})

test('login fail condition', t => {
  const gen = loginFlow()
  t.deepEqual(
    gen.next().value,
    take(loginActions.REQUEST)
  )
  t.deepEqual(
    gen.next(action).value,
    call(api.login, payload)
  )
  // test failure condition
  t.deepEqual(
    gen.next(failureResponse).value,
    put(loginActions.failure(failureResponse.error.text))
  )
})


// --------------------------------- register flow
test('register success condition', t => {
  const gen = registerFlow()
  t.deepEqual(
    gen.next().value,
    take(registerActions.REQUEST)
  )
  t.deepEqual(
    gen.next(action).value,
    call(api.register, payload)
  )
  t.deepEqual(
    gen.next(response).value,
    put(registerActions.success(response))
  )
  t.deepEqual(
    gen.next().value,
    take(registerActions.REQUEST)
  )
})

test('register fail condition', t => {
  const gen = registerFlow()
  t.deepEqual(
    gen.next().value,
    take(registerActions.REQUEST)
  )
  t.deepEqual(
    gen.next(action).value,
    call(api.register, payload)
  )
  t.deepEqual(
    gen.next(failureResponse).value,
    put(registerActions.failure(failureResponse.error.text))
  )
})

// --------------------------------- logout flow
test('logout success condition', t => {
  const gen = logoutFlow()
  t.deepEqual(
    gen.next().value,
    take(logoutActions.REQUEST)
  )
  t.deepEqual(
    gen.next(action).value,
    call(api.logout, payload)
  )
  t.deepEqual(
    gen.next(response).value,
    put(logoutActions.success(response))
  )
  t.deepEqual(
    gen.next().value,
    take(logoutActions.REQUEST)
  )
})

test('logout fail condition', t => {
  const gen = logoutFlow()
  t.deepEqual(
    gen.next().value,
    take(logoutActions.REQUEST)
  )
  t.deepEqual(
    gen.next(action).value,
    call(api.logout, payload)
  )
  t.deepEqual(
    gen.next(failureResponse).value,
    put(logoutActions.failure(failureResponse.error.text))
  )
})

/* eslint-disable no-alert */
import { fork, take, call, put } from 'redux-saga/effects'
import {
  loginActions,
  logoutActions,
  registerActions,
} from './actions'

import * as api from '../../api'

// We won't let user to tiggle `LOGOUT` action while the `login` or `register` effect is going on.
// So we don't need to care about a race condition.

// Users won't get the UI to triggle `LOGOUT` action before them have logined or registered.

function* loginFlow() {
  while (true) {
    const { payload } = yield take(loginActions.REQUEST)
    try {
      const { error, ...rest } = yield call(api.login, payload)
      if (error) throw new Error(error.text)
      yield put(loginActions.success(rest))
      alert('login success !')
    } catch (e) {
      yield put(loginActions.failure(e))
      alert(e)
    }
  }
}

function* logoutFlow() {
  while (true) {
    const { payload } = yield take(logoutActions.REQUEST)
    try {
      const { error, ...rest } = yield call(api.logout, payload)
      if (error) throw new Error(error.text)
      yield put(logoutActions.success(rest))
    } catch (e) {
      yield put(logoutActions.failure(e))
      alert(e)
    }
  }
}

function* registerFlow() {
  while (true) {
    const { payload } = yield take(registerActions.REQUEST)
    try {
      const { error, ...rest } = yield call(api.register, payload)
      if (error) throw new Error(error.text)
      yield put(registerActions.success(rest))
      alert('register sucess !')
    } catch (e) {
      yield put(registerActions.failure(e))
      alert(e)
    }
  }
}

export default function* () {
  yield [
    fork(loginFlow),
    fork(logoutFlow),
    fork(registerFlow),
  ]
}


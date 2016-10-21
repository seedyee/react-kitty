import { fork, take, call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import {
  loginActions,
  logoutActions,
  registerActions,
} from './actions'
import api from '../../../api'

// We won't let user to tiggle `LOGOUT` action while the `login` or `register` effect is going on.
// So we don't need to care about a race condition.

// Users won't get the UI to triggle `LOGOUT` action before them have logined or registered.

function* loginFlow() {
  while (true) {
    const { payload } = yield take(loginActions.REQUEST)
    try {
      const response = yield call(api.login, payload)
      yield put(loginActions.success(response))
      alert('login success !') // eslint-disable-line no-alert
      yield put(push('/dashboard'))
    } catch (error) {
      yield put(loginActions.failure(error))
      alert(error.message) // eslint-disable-line no-alert
    }
  }
}

function* logoutFlow() {
  while (true) {
    const { payload } = yield take(logoutActions.REQUEST)
    try {
      const response = yield call(api.logout, payload)
      yield put(logoutActions.success(response))
      yield put(push('/'))
    } catch (error) {
      yield put(logoutActions.failure(error))
    }
  }
}

function* registerFlow() {
  while (true) {
    const { payload } = yield take(registerActions.REQUEST)
    try {
      const response = yield call(api.register, payload)
      yield put(registerActions.success(response))
      alert('register sucess !') // eslint-disable-line no-alert
      yield put(push('/dashboard'))
    } catch (error) {
      yield put(registerActions.failure(error))
      alert(error.message) // eslint-disable-line no-alert
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


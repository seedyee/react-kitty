import { fork, take, call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import {
  loginActionTypes,
  loginSuccess,
  loginFailure,

  logoutActionTypes,
  logoutSuccess,
  logoutFailure,
} from './actions'
import api from '../../../api'

// We won't let user to tiggle `LOGOUT` action while the `login` or `register` effect is going on.
// So we don't need to care about a race condition.

// Users won't get the UI to triggle `LOGOUT` action before them have logined or registered.

function* loginFlow() {
  while (true) {
    const { payload } = yield take(loginActionTypes.REQUEST)
    try {
      const response = yield call(api.login, payload)
      yield put(loginSuccess(response))
      alert('logind !') // eslint-disable-line no-alert
      yield put(push('/dashboard'))
      return response
    } catch (error) {
      yield put(loginFailure(error))
      alert('User doesn\'t exist !') // eslint-disable-line no-alert
    }
  }
}

function* logoutFlow() {
  while (true) {
    const { payload } = yield take(logoutActionTypes.REQUEST)
    try {
      const response = yield call(api.logout, payload)
      yield put(logoutSuccess(response))
      return response
    } catch (error) {
      yield put(logoutFailure(error))
    }
  }
}

function* registerFlow() {
  while (true) {
    yield take('REGISTER')
    // todo
  }
}

export default function* () {
  yield [
    fork(loginFlow),
    fork(logoutFlow),
    fork(registerFlow),
  ]
}


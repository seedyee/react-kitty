import { fork, take, call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { loginActionTypes, loginSuccess, loginFailure } from './actions'
import api from '../../../api'

function* loginFolow() {
  while (true) {
    const { payload } = yield take(loginActionTypes.REQUEST)
    try {
      const result = yield call(api.login, payload)
      yield put(loginSuccess(result))
      alert('logind !') // eslint-disable-line no-alert
      yield put(push('/dashboard'))
    } catch (e) {
      yield put(loginFailure(e))
      alert('User doesn\'t exist !') // eslint-disable-line no-alert
    }
  }
}

export default function* () {
  yield [
    fork(loginFolow),
  ]
}


import { put, call, fork, select } from 'redux-saga/effects'

import * as api from '../../api'
import { selectUsers } from './selectors'
import { loadUsersActions } from './actions'

// We are using SSR(server-side-rendering), if everything goes well we should have users in our
// initialState thus we don't need to request users on client side again.
// actually, in client side this saga does nothing and it would return directly.
function* loadUsers() {
  const users = yield select(selectUsers)
  if (users) return
  yield put(loadUsersActions.request())
  try {
    const response = yield call(api.loadUsers)
    yield put(loadUsersActions.success(response))
  } catch (e) {
    yield put(loadUsersActions.failure(e))
  }
}

export default function* homeSaga() {
  yield [
    fork(loadUsers),
  ]
}

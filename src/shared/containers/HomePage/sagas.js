import { put, take, fork } from 'redux-saga/effects'

import { HELLO } from './actions'
let count = 1

function* hello() {
  yield put({ type: HELLO, payload: `Hello ${count += 1}` })
  yield put({ type: HELLO, payload: `Hello ${count += 1}` })
}

function* watchHello() {
  while (true) {
    const action = yield take(HELLO)
    console.log(action.payload)
  }
}

export default function* homeSaga() {
  yield [
    fork(watchHello),
    fork(hello),
  ]
}

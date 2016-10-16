import { put, take } from 'redux-saga/effects'

import { HELLO } from './actions'
// change count to see sagas hot-reload
let count = 2

function* hello() {
  yield put({ type: HELLO, payload: `Hello ${count += 1}` })
  yield put({ type: HELLO, payload: `Hello ${count += 1}` })
}

function* watchHello() {
  while (true) { // eslint-disable-line no-constant-condition
    const action = yield take(HELLO)
    console.log(action.payload)
  }
}

export default [
  watchHello,
  hello,
]

import { put, take } from 'redux-saga/effects'
import { HELLO }  from './actions'
import { push } from 'react-router-redux'

// change count to see sagas hot-reload
let count = 1

function* hello() {
  yield put({ type: HELLO, payload: `Hello ${count++}` })
  yield put({ type: HELLO, payload: `Hello ${count++}` })
}

function* watchHello() {
  while (true) {
    const action = yield take(HELLO)
    console.log(action.payload)
  }
}

function* changeLocation() {
  yield put(push('/about'))
}

export default [
  watchHello,
  hello,
  changeLocation,
]

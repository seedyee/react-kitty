import { put } from 'redux-saga/effects'

let count = 0

function* switchUser() {
  yield put({ type: 'SWITCH_USER', payload: `user ${count++}` })
}

export default [
  switchUser,
]

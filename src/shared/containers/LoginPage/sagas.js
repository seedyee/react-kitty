import { fork, take, } from 'redux-saga/effects'

function* loginFolow() {
  yield take('login')
}


export default function* () {
  yield [
    fork(loginFolow),
  ]
}


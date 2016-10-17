import { fork } from 'redux-saga/effects'
import homeSaga from './containers/HomePage/sagas'


export default function* rootSaga() {
  yield [
    fork(homeSaga),
  ]
}

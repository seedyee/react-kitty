import { fork, join } from 'redux-saga/effects'
import HomeSagas from './containers/HomePage/sagas'

// CUSTOM METHOD FOR USAGE AT server.js TO RUN SAGAS ON SERVER SIDE (e.g. fetch data)
export const waitAll = (sagas) => function* genTasks() {
  const tasks = yield sagas.map(([saga, ...params]) => fork(saga, ...params))
  yield tasks.map(join)
}

export default [
  ...HomeSagas,
]

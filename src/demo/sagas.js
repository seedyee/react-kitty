import { fork, join, cancel, take } from 'redux-saga/effects'
import homeSagas from './containers/HomePage/sagas'

// CUSTOM METHOD FOR USAGE AT server.js TO RUN SAGAS ON SERVER SIDE (e.g. fetch data)
export const waitAll = (sagas) => function* genTasks() {
  const tasks = yield sagas.map(([saga, ...params]) => fork(saga, ...params))
  yield tasks.map(join)
}

const sagas = [...homeSagas]

export const CANCEL_SAGAS_HMR = 'CANCEL_SAGAS_HMR'

function createAbortableSaga (saga) {
  if (process.env.NODE_ENV === 'development') {
    return function* main () {
      const sagaTask = yield fork(saga)
      yield take(CANCEL_SAGAS_HMR)
      yield cancel(sagaTask)
    }
  } else {
    return saga
  }
}

const SagaManager = {
  startSagas(sagaMiddleware) {
    sagas.map(createAbortableSaga).forEach((saga) => sagaMiddleware.run(saga))
  },

  cancelSagas(store) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR
    })
  }
}

export default SagaManager

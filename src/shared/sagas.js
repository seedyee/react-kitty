import { fork, cancel, take } from 'redux-saga/effects'
import homeSagas from './containers/HomePage/sagas'

const rootSagas = [...homeSagas]

export const CANCEL_SAGAS_HMR = 'CANCEL_SAGAS_HMR'
function createAbortableSaga(saga) {
  if (process.env.NODE_ENV === 'development') {
    return function* main() {
      const sagaTask = yield fork(saga)
      yield take(CANCEL_SAGAS_HMR)
      yield cancel(sagaTask)
    }
  }
  return saga
}

export const SagaManager = {
  startSagas(sagaMiddleware) {
    rootSagas.map(createAbortableSaga).forEach(saga => sagaMiddleware.run(saga))
  },

  cancelSagas(store) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR,
    })
  },
}

export default rootSagas

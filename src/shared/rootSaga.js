import { fork, cancel, take } from 'redux-saga/effects'

import reduxFormSubmitSaga from './utils/reduxFormSubmitSaga'

import homeSaga from './modules/HomePage/sagas'
import authSaga from './modules/Auth/sagas'

export function* rootSaga() {
  yield [
    fork(reduxFormSubmitSaga),
    fork(homeSaga),
    fork(authSaga),
  ]
}
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

const SagaManager = {
  startSaga(sagaMiddleware) {
    return sagaMiddleware.run(createAbortableSaga(rootSaga))
  },
  cancelSaga(store) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR,
    })
  },
}

export default SagaManager


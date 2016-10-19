import { fork } from 'redux-saga/effects'

import reduxFormSubmitSaga from './utils/reduxFormSubmitSaga'
/* import homeSaga from './containers/HomePage/sagas'*/
import authSaga from './containers/Auth/sagas'

function* rootSaga() {
  yield [
    fork(reduxFormSubmitSaga),
    fork(authSaga),
  ]
}

export default rootSaga

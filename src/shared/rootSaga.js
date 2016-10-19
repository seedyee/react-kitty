import { fork } from 'redux-saga/effects'

import reduxFormSubmitSaga from './utils/reduxFormSubmitSaga'
/* import homeSaga from './containers/HomePage/sagas'*/
import loginSaga from './containers/LoginPage/sagas'

function* rootSaga() {
  yield [
    fork(reduxFormSubmitSaga),
    fork(loginSaga),
  ]
}

export default rootSaga

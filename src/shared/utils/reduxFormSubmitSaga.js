import { put, take, race, call } from 'redux-saga/effects'
import { SubmissionError } from 'redux-form/immutable'
const identity = f => f
export const SUBMIT_FORM = '$$/SUBMIT_FORM'

const submitForm = (payload, actions, resolve, reject) => ({
  type: SUBMIT_FORM,
  actions,
  payload,
  resolve,
  reject,
})


export const onSubmitActions = (actions, valuesTransform = identity) =>
  (values, dispatch) => new Promise((resolve, reject) => {
    dispatch(submitForm(valuesTransform(values.toJS()), actions, resolve, reject))
  })

export default function* reduxFormSubmitSaga() {
  while (true) { // eslint-disable-line no-constant-condition
    const { actions: { REQUEST, SUCCESS, FAILURE }, resolve, reject, payload } = yield take(SUBMIT_FORM)
    yield put({ type: REQUEST, payload })

    const { success, failure } = yield race({
      success: take(SUCCESS),
      failure: take(FAILURE),
    })
    if (success) {
      yield call(resolve, success.payload)
    } else {
      yield call(reject, new SubmissionError(failure.payload))
    }
  }
}


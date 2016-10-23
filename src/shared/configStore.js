import { createStore, applyMiddleware, compose } from 'redux'
import { fromJS } from 'immutable'
import createSagaMiddleware, { END } from 'redux-saga'
import reducers from './reducers'
import SagaManager from './rootSaga'

const sagaMiddleware = createSagaMiddleware()
const devtools = (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.devToolsExtension) || (() => noop => noop)

// hot relaod sagas
// https://gist.github.com/hoschi/6538249ad079116840825e20c48f1690

export default function configureStore(initialState = {}) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
    sagaMiddleware,
  ]

  const enhancers = [
    applyMiddleware(...middlewares),
    devtools(),
  ]

  const store = createStore(
    reducers,
    fromJS(initialState),
    compose(...enhancers)
  )

  // Create hook for async sagas
  store.runSaga = sagaMiddleware.run
  store.startAbortableSaga = () => SagaManager.startSaga(sagaMiddleware)
  store.close = () => store.dispatch(END)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducers = require('./reducers').default // eslint-disable-line global-require
      store.replaceReducer(nextReducers)
    })

    module.hot.accept('./rootSaga', () => {
      SagaManager.cancelSaga(store)
      require('./rootSaga').default.startSaga(sagaMiddleware) // eslint-disable-line global-require
    })
  }
  return store
}

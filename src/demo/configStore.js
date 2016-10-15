/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers'
import SagaManager from './sagas'

const sagaMiddleware = createSagaMiddleware()
const devtools = (typeof window !== 'undefined' && window.devToolsExtension) || (() => noop => noop)

// hot relaod sagas
// https://gist.github.com/hoschi/6538249ad079116840825e20c48f1690

export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
  ]

  const enhancers = [
    applyMiddleware(...middlewares),
    devtools(),
  ]

  const store = createStore(
    reducers,
    initialState,
    compose(...enhancers)
  )

  // Create hook for async sagas
  store.runSaga = sagaMiddleware.run

  // run sagas
  SagaManager.startSagas(sagaMiddleware)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducers = require('./reducers').default // eslint-disable-line global-require
      store.replaceReducer(nextReducers)
    })

    module.hot.accept('./sagas', () => {
      SagaManager.cancelSagas(store)
      require('./sagas').default.startSagas(sagaMiddleware) // eslint-disable-line global-require
    })
  }

  // Initialize it with no other reducers
  store.asyncReducers = {}
  return store
}

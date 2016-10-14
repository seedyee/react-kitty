/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers'

const sagaMiddleware = createSagaMiddleware()
const devtools = (typeof window !== 'undefined' && window.devToolsExtension) || (() => noop => noop)

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

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducers = require('./reducers').default // eslint-disable-line global-require
      store.replaceReducer(nextReducers)
    })
  }

  // Initialize it with no other reducers
  store.asyncReducers = {}
  return store
}

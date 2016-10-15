import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Router from 'react-router/lib/Router'
import browserHistory from 'react-router/lib/browserHistory'
import match from 'react-router/lib/match'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import routes from '../shared/routes'
import configureStore from '../shared/configStore'


import { IS_HOT_DEVELOPMENT } from '../common/config'

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app')
const initialState = window.APP_STATE || {} // eslint-disable-line
const store = configureStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store)

function routerError(error) {
  // TODO: Error handling.
  console.error('React Router match failed.') // eslint-disable-line no-console
  if (error) { console.error(error) } // eslint-disable-line no-console
}


function renderApp() {
  // As we are using dynamic react-router routes we have to use the following
  // asynchronous routing mechanism supported by the `match` function.
  // @see https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
  match({ history, routes }, (error, redirectLocation, renderProps) => {
    if (error) {
      routerError(error)
    } else if (redirectLocation) {
      return
    } else if (renderProps) {
      render(
        <AppContainer>
          <Provider store={store}>
            <Router {...renderProps} />
          </Provider>
        </AppContainer>,
        container
      )
    } else {
      routerError()
    }
  })
}

// The following is needed so that we can hot reload our App.
if (IS_HOT_DEVELOPMENT) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js')

  // Any changes to our routes will cause a hotload re-render.
  module.hot.accept('../shared/routes', renderApp)
}

renderApp()

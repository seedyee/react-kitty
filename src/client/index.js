import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from '../shared/configStore'
import App from '../shared/modules/App/index'
import { IS_HOT_DEVELOPMENT } from '../common/config'

const container = document.querySelector('#app')
const initialState = window.APP_STATE || {} // eslint-disable-line
const store = configureStore(initialState)
// start rootSagas on client
store.startAbortableSaga()


function renderApp(RootComponent) {
  render(
    <AppContainer>
      <BrowserRouter>
        <Provider store={store}>
          <RootComponent />
        </Provider>
      </BrowserRouter>
    </AppContainer>,
    container
  )
}

// The following is needed so that we can support hot reloading our application.
if (process.env.NODE_ENV === 'development' && module.hot && IS_HOT_DEVELOPMENT) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js')
  // Any changes to our App will cause a hotload re-render.
  module.hot.accept(
    '../shared/modules/App/index',
    () => renderApp(require('../shared/modules/App/index').default) // eslint-disable-line
  )
}

renderApp(App)

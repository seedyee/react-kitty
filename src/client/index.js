import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from '../shared/configStore'
import App from '../shared/modules/App'

const container = document.querySelector('#app')
const initialState = window.APP_STATE || {} // eslint-disable-line
const store = configureStore(initialState)
// start rootSagas on client
store.startAbortableSaga()

function renderApp() {
  render(
    <AppContainer>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </AppContainer>,
    container
  )
}

// The following is needed so that we can support hot reloading our application.
if (process.env.NODE_ENV === 'development' && module.hot) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js', () => renderApp())
  // Any changes to our App will cause a hotload re-render.
  module.hot.accept(
    '../shared/modules/App',
    () => renderApp()
  )
}

renderApp()

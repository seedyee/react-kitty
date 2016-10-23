import React from 'react'
import { Provider } from 'react-redux'
import { ServerRouter, createServerRenderContext } from 'react-router'

import render from './render'
import { DISABLE_SSR } from './config'
import { IS_DEVELOPMENT } from '../common/config'
import configureStore from '../shared/configStore'
/* import { rootSaga } from '../shared/rootSaga'*/
import App from '../shared/modules/App/index'

/**
 * An express middleware that is capabable of doing React server side rendering.
 */
export default function universalMiddleware(req, res) {
  /* eslint-disable no-magic-numbers */
  if (DISABLE_SSR) {
    if (IS_DEVELOPMENT) {
      console.log('Handling react route without SSR')  // eslint-disable-line no-console
    }
    // SSR is disabled so we will just return an empty html page and will
    // rely on the client to populate the initial react application state.
    const html = render()
    res.status(200).send(html)
    return
  }

  // First create a context for <ServerRouter>, which will allow us to
  // query for the results of the render.
  const context = createServerRenderContext()
  const store = configureStore({})
  // Create the application react element.
  const app = (
    <Provider store={store}>
      <ServerRouter
        location={req.url}
        context={context}
      >
        <App />
      </ServerRouter>
    </Provider>
  )

  // Get the render result from the server render context.
  const html = render(app, store.getState())
  const result = context.getResult()

  // Check if the render result contains a redirect, if so we need to set
  // the specific status and redirect header and end the res.
  if (result.redirect) {
    res.status(301).setHeader('Location', result.redirect.pathname)
    res.end()
    return
  }

  res.status(result.missed ? 404 : 200).send(html)
}


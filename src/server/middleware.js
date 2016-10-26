import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { ServerRouter, createServerRenderContext } from 'react-router'

import render from './render'
import { DISABLE_SSR } from './config'
import configureStore from '../shared/configStore'
import { rootSaga } from '../shared/rootSaga'
import App from '../shared/modules/App/index'

/**
 * An express middleware that is capabable of doing React server side rendering.
 */
export default function universalMiddleware(req, res) {
  /* eslint-disable no-magic-numbers */
  if (DISABLE_SSR) {
    // SSR is disabled so we will just return an empty html page and will
    // rely on the client to populate the initial react application state.
    try {
      const html = render()
      res.status(200).send(html)
    } catch (ex) {
      res.status(500).send(`Error during rendering: ${ex}!`)
    }
    return
  }

  // First create a context for <ServerRouter>, which will allow us to
  // query for the results of the render.
  const context = createServerRenderContext()
  const store = configureStore({})
  // Create the application react element.
  const rootComponent = (
    <Provider store={store}>
      <ServerRouter
        location={req.url}
        context={context}
      >
        <App />
      </ServerRouter>
    </Provider>
  )


  const result = context.getResult()

  // Check if the render result contains a redirect, if so we need to set
  // the specific status and redirect header and end the res.
  if (result.redirect) {
    res.status(301).setHeader('Location', result.redirect.pathname)
    res.end()
    return
  }
  try {
    store.runSaga(rootSaga).done.then(() => {
      const html = render(
        rootComponent,
        store.getState().toJS()
      )
      res.send(html)
    })

    // Trigger sagas for component to run
    // https://github.com/yelouafi/redux-saga/issues/255#issuecomment-210275959
    renderToString(rootComponent)
    // Dispatch a close event so sagas stop listening after they're resolved
    store.close()
  } catch (ex) {
    res.status(500).send(`Error during rendering: ${ex}!`)
  }
}


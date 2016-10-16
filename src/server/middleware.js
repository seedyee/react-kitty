import React from 'react'
import { renderToString } from 'react-dom/server';
import RouterContext from 'react-router/lib/RouterContext'
import createMemoryHistory from 'react-router/lib/createMemoryHistory'
import match from 'react-router/lib/match'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'

import render from './render'
import routes from '../shared/routes'
import { DISABLE_SSR } from './config'
import { IS_DEVELOPMENT } from '../common/config'
import configureStore from '../shared/configStore'
import rootSagas from '../shared/sagas'
import { selectLocationState } from '../shared/selectors'

/**
 * An express middleware that is capabable of doing React server side rendering.
 */
export default function universalMiddleware(request, response) {
  /* eslint-disable no-magic-numbers */
  if (DISABLE_SSR) {
    if (IS_DEVELOPMENT) {
      console.log('Handling react route without SSR')  // eslint-disable-line no-console
    }
    // SSR is disabled so we will just return an empty html page and will
    // rely on the client to populate the initial react application state.
    const html = render()
    response.status(200).send(html)
    return
  }

  const memoryHistory = createMemoryHistory(request.originalUrl)
  const store = configureStore({}, memoryHistory)
  const history = syncHistoryWithStore(memoryHistory, store, {
    selectLocationState: selectLocationState(),
  })

  // Server side handling of react-router.
  // Read more about this here:
  // https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
  match({ routes, history }, (error, redirectLocation, renderProps) => {
    if (error) {
      response.status(500).send(error.message)
    } else if (redirectLocation) {
      response.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // You can check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.

      // saga server-side-rendering
      // https://github.com/yelouafi/redux-saga/issues/13

      try {
        const rootComponent = (
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        )
        const tasks = rootSagas.map(saga => store.runSaga(saga).done)
        Promise.all(tasks).then(() => {
          const html = render(
            rootComponent,
            store.getState()
          )
          response.status(200).send(html)
        })
        // Trigger sagas for component to run
        // https://github.com/yelouafi/redux-saga/issues/255#issuecomment-210275959
        renderToString(rootComponent)
        // Dispatch a close event so sagas stop listening after they're resolved
        store.close()
      } catch (ex) {
        response.status(500).send(`Error during rendering: ${ex}!`)
      }
    } else {
      response.status(404).send('Not found')
    }
  })
}

import React from 'react'
import Route from 'react-router/lib/Route'
import IndexRoute from 'react-router/lib/IndexRoute'

import App from './containers/App'

function handleError(err) {
  // TODO: Error handling, do we return an Error component here?
  console.log('Error occurred loading dynamic route') // eslint-disable-line no-console
  console.log(err) // eslint-disable-line no-console
}

function resolveIndexPage(nextState, cb) {
  System.import('./containers/HomePage')
    .then(module => cb(null, module.default))
    .catch(handleError)
}

function resolveAboutPage(nextState, cb) {
  System.import('./containers/AboutPage')
    .then(module => cb(null, module.default))
    .catch(handleError)
}

function resolveLoginPage(nextState, cb) {
  System.import('./containers/LoginPage')
    .then(module => cb(null, module.default))
    .catch(handleError)
}

function resolveRegisterPage(nextState, cb) {
  System.import('./containers/RegisterPage')
    .then(module => cb(null, module.default))
    .catch(handleError)
}
function resolveDashboardPage(nextState, cb) {
  System.import('./containers/DashboardPage')
        .then(module => cb(null, module.default))
        .catch(handleError)
}

function resolveNotFoundPage(nextState, cb) {
  System.import('./containers/NotFoundPage')
        .then(module => cb(null, module.default))
        .catch(handleError)
}

const routes = store => (
  <Route path="/" component={App}>
    <IndexRoute getComponent={resolveIndexPage} />
    <Route path="about" getComponent={resolveAboutPage} />
    <Route>
      <Route path="/login" getComponent={resolveLoginPage} />
      <Route path="/register" getComponent={resolveRegisterPage} />
      <Route path="/dashboard" getComponent={resolveDashboardPage} />
    </Route>
    <Route path="*" getComponent={resolveNotFoundPage} />
  </Route>
)

export default routes

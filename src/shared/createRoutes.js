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
  System.import('./containers/Auth/LoginPage')
    .then(module => cb(null, module.default))
    .catch(handleError)
}

function resolveRegisterPage(nextState, cb) {
  System.import('./containers/Auth/RegisterPage')
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

/**
 * Checks authentication status on route change
 * @param  {object}   nextState The state we want to change into when we change routes
 * @param  {function} replace Function provided by React Router to replace the location
 */
const redirectToHome = (store) => (nextState, replace) => {
  // If already logined don't let user enter `/login` or `/register` route
  const logined = store.getState().getIn(['auth', 'logined'])
  if (logined) {
    replace('/')
  }
}

const checkAuth = (store) => (nextState, replace) => {
  const logined = store.getState().getIn(['auth', 'logined'])
  if (!logined) {
    if (typeof document !== 'undefined') {
      alert('Protected route, Login first !') // eslint-disable-line no-alert
    }
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    })
  }
}

const routes = store => ( // eslint-disable-line no-unused-vars
  <Route path="/" component={App}>
    <IndexRoute getComponent={resolveIndexPage} />
    <Route path="/about" getComponent={resolveAboutPage} />
    <Route path="/login" onEnter={redirectToHome(store)} getComponent={resolveLoginPage} />
    <Route path="/register" onEnter={redirectToHome(store)} getComponent={resolveRegisterPage} />
    <Route path="/dashboard" onEnter={checkAuth(store)} getComponent={resolveDashboardPage} />
    <Route path="*" getComponent={resolveNotFoundPage} />
  </Route>
)

export default routes

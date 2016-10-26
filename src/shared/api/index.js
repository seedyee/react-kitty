import fetch from 'isomorphic-fetch'

/**
 * The Promise returned from fetch() won't reject on HTTP error status
 * even if the response is a HTTP 404 or 500.
 *
 * By default, fetch won't send any cookies to the server,
 * resulting in unauthenticated requests if the site relies on maintaining a user session.
 */

// To have fetch Promise reject on HTTP error statuses, i.e. on any non-2xx status
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

const parseJSON = (response) => {
  const contentType = response.headers.get('Content-Type')
  if ((/^text\/plain/i).test(contentType)) {
    return response.text()
  } else if ((/^application\/json/i).test(contentType)) {
    return response.json()
  }
  throw new Error('Accept text/plain and application/json but not other types !')
}

const urlRoot = `http://localhost:${process.env.SERVER_PORT}`
const apiPrefix = '/dev/api'
const request = ({ method, url, data }) => fetch(urlRoot + apiPrefix + url, {
  // Use the include value to send cookies in a
  // cross-origin resource sharing (CORS) request
  // credentials: 'include',

  // Automatically send cookies for the current domain
  method,
  credentials: 'same-origin',
  headers: {
    Accept: 'application/json,text/plain',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
}).then(checkStatus).then(parseJSON)

export const post = (url, data) => request({ method: 'POST', url, data })
export const get = (url) => request({ method: 'GET', url })

export const login = (data) => post('/login', data)
export const register = (data) => post('/register', data)
export const logout = (id) => get(`/logout?id=${id}`)
export const loadUsers = () => get('/users')

import universalReactAppMiddleware from './middleware'
import { SERVER_PORT } from './config'
import generateServer from './factory'
import proxyMiddleware from './proxy'
import apiRouter from './api'

const app = generateServer()
// proxy `/api` requests
app.use('/api', proxyMiddleware())

app.use('/dev/api', apiRouter)

// Bind our universal react app middleware as the handler for all get requests.
app.get('*', universalReactAppMiddleware)

// Create an http listener for our express app.
const listener = app.listen(SERVER_PORT)

// We export the listener as it will be handy for our development hot reloader.
export default listener

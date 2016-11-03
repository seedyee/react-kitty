import bodyParser from 'body-parser'
import express from 'express'
import compression from 'compression'
import shrinkRay from 'shrink-ray'
import hpp from 'hpp'

import {
  CLIENT_BUNDLE_HTTP_PATH,
  CLIENT_BUNDLE_OUTPUT_PATH,
  CLIENT_BUNDLE_CACHE_MAXAGE,
  PUBLIC_DIR_PATH,
} from './config'

export default function generateServer() {
  // Create our express based server.
  const app = express()

  // Don't expose any software information to hackers.
  app.disable('x-powered-by')

  // Prevent HTTP Parameter pollution.
  app.use(hpp())

  // Advanced response compression using a async zopfli/brotli combination
  // https://github.com/aickin/shrink-ray
  app.use(shrinkRay())

  const jsonBodyParser = bodyParser.json()
  app.use(jsonBodyParser)
  // Configure static serving of our webpack bundled client files.
  app.use(
    CLIENT_BUNDLE_HTTP_PATH,
    express.static(CLIENT_BUNDLE_OUTPUT_PATH, { maxAge: CLIENT_BUNDLE_CACHE_MAXAGE })
  )

  // Configure static serving of our "public" root http path static files.
  app.use(express.static(PUBLIC_DIR_PATH))

  return app
}

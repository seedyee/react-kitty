import os from 'os'
import path from 'path'
import BabelConfigClient from './webpack.babel.client'
import BabelConfigServer from './webpack.babel.server'

import { merge, ifElse } from './util'

const createJsRules = (target, mode) => {
  const root = process.cwd()
  const isDev = mode === 'development'
  const isProd = mode === 'production'
  const isClient = target === 'client'
  const isServer = target === 'server'

  const ifClient = ifElse(isClient)
  const ifServer = ifElse(isServer)
  const ifDevServer = ifElse(isDev && isServer) // eslint-disable-line no-unused-vars
  const ifProdServer = ifElse(isProd && isServer)
  const projectId = path.basename(root)

  return [
    {
      test: /\.json$/,
      // Before going through our normal loaders, we convert simple JSON files to JS
      // This is useful for further processing e.g. compression with babili
      enforce: 'pre',
      loader: 'json-loader',
    },

    // Javascript
    {
      test: /\.(js|jsx|json)$/,
      loader: 'babel-loader',
      exclude: [
        /node_modules/,
        path.resolve(root, process.env.CLIENT_BUNDLE_OUTPUT_PATH),
        path.resolve(root, process.env.SERVER_BUNDLE_OUTPUT_PATH),
      ],
      query: merge(
        {
          // Enable caching for babel transpiles
          // Babel-Loader specific setting
          cacheDirectory: path.resolve(os.tmpdir(), projectId, 'babel-local'),

          env: {
            production: {
              presets: ['babili'],
              comments: false,
            },
            development: {
              plugins: ['react-hot-loader/babel'],
            },
          },
        },

        ifServer(BabelConfigServer),
        ifClient(BabelConfigClient)
      ),
    },

    // External JavaScript
    ifProdServer({
      test: /\.(js|json)$/,
      loader: 'babel-loader',
      exclude: [path.resolve(root, 'src')],
      query: {
        // Enable caching for babel transpiles
        // Babel-Loader specific setting
        cacheDirectory: path.resolve(os.tmpdir(), projectId, 'babel-external'),

        // Don't try to find .babelrc because we want to force this configuration.
        // This is critical for 3rd party as they sometimes deliver `.babelrc`
        // inside their npm packages (which is wrong BTW, but we can't fix the whole world)
        babelrc: false,

        // Faster transpiling for minor loose in formatting
        compact: true,

        // Keep origin information alive
        sourceMaps: true,

        // Nobody needs the original comments when having source maps
        comments: false,

        env: {
          production: {
            // Adding babili to babel does not remove comments/formatting added by Webpack.
            // It works on a per-file level which is actually better to cache.
            // What's needed is some output flag for webpack to omit adding too much cruft
            // to the output.
            // To postprocess the result (remove comments/rename webpack vars) one can use
            // babel --no-comments --plugins minify-mangle-names bundle.js
            // See also: https://github.com/webpack/webpack/issues/2924
            presets: ['babili'],
            comments: false,
          },
        },
      },
    }),

    // Typescript + Typescript/JSX
    // https://github.com/s-panferov/awesome-typescript-loader
    {
      test: /\.(ts|tsx)$/,
      loader: 'awesome-typescript-loader',
    },
  ]
}
export default createJsRules


import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { merge, ifElse } from './util'

const createCssRules = (target, mode) => {
  const isDev = mode === 'development'
  const isProd = mode === 'production'
  const isClient = target === 'client'
  const isServer = target === 'server'

  const ifProd = ifElse(isProd)
  const ifServer = ifElse(isServer)
  const ifDevClient = ifElse(isDev && isClient)
  const ifDevServer = ifElse(isDev && isServer) // eslint-disable-line no-unused-vars
  const ifProdClient = ifElse(isProd && isClient)

  const cssRules = [
    { test: /\.css$/ },
    // When targetting the server we fake out the style loader as the
    // server can't handle the styles and doesn't care about them either..
    ifServer({
      loaders: [
        {
          loader: 'css-loader/locals',
          query: {
            sourceMap: false,
            modules: true,
            localIdentName: ifProd('[local]-[hash:base62:8]', '[path][name]-[local]'),
            minimize: false,
          },
        },
        { loader: 'postcss-loader' },
      ],
    }),

    // For a production client build we use the ExtractTextPlugin which
    // will extract our CSS into CSS files. The plugin needs to be
    // registered within the plugins section too.
    ifProdClient({
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: [
          {
            loader: 'css-loader',
            query: {
              modules: true,
              sourceMap: true,
              localIdentName: '[local]-[hash:base62:8]',
            },
          },
          { loader: 'postcss-loader' },
        ],
      }),
    }),
    // For a development client we will use a straight style & css loader
    // along with source maps. This combo gives us a better development
    // experience.
    ifDevClient({
      loaders: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          query: {
            sourceMap: true,
            modules: true,
            localIdentName: '[path][name]-[local]',
            minimize: false,
            import: false,
          },
        },
        { loader: 'postcss-loader' },
      ],
    }),
  ]
  return merge(...cssRules)
}

export default createCssRules


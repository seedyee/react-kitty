import path from 'path'
import webpack from 'webpack'
import AssetsPlugin from 'assets-webpack-plugin'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'
import Dashboard from 'webpack-dashboard/plugin'
import ProgressBar from 'progress-bar-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'
import WebpackDigestHash from './ChunkHash'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

// Waiting for Pull-Request being merged:
// https://github.com/diurnalist/chunk-manifest-webpack-plugin/pull/13
import ChunkManifestPlugin from './ChunkManifestPlugin'
import getPostCSSConfig from './PostCSSConfig'

import { removeEmpty, ifElse } from './util'

const createPlugins = (target, mode) => {
  const ifIntegration = ifElse(process.env.CI || false)
  const ifUniversal = ifElse(process.env.DISABLE_SSR)
  const root = process.cwd()
  const isDev = mode === 'development'
  const isProd = mode === 'production'
  const isClient = target === 'client'
  const isServer = target === 'server'

  const ifDev = ifElse(isDev)
  const ifProd = ifElse(isProd)
  const ifClient = ifElse(isClient)
  const ifServer = ifElse(isServer)
  const ifDevClient = ifElse(isDev && isClient)
  const ifDevServer = ifElse(isDev && isServer) // eslint-disable-line no-unused-vars
  const ifProdClient = ifElse(isProd && isClient)

  return removeEmpty([

    // Create static HTML page. This can be used when server rendering is not interesting.
    ifUniversal(null, ifProdClient(new HtmlPlugin())),

    // Render Dashboard for Client Development + ProgressBar for production builds
    ifIntegration(null, ifDevClient(new Dashboard())),
    ifIntegration(null, ifProd(new ProgressBar())),

    // For server bundle, you also want to use 'source-map-support' which automatically sourcemaps
    // stack traces from NodeJS. We need to install it at the top of the generated file, and we
    // can use the BannerPlugin to do this.
    // - `raw`: true tells webpack to prepend the text as it is, not wrapping it in a comment.
    // - `entryOnly`: false adds the text to all generated files, which you might have multiple if using code splitting.
    // Via: http://jlongster.com/Backend-Apps-with-Webpack--Part-I
    ifServer(new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    })),

    // Extract vendor bundle for keeping larger parts of the application code
    // delivered to users stable during development (improves positive cache hits)
    ifProdClient(new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    })),

    // More aggressive chunk merging strategy. Even similar chunks are merged if the
    // total size is reduced enough.
    ifProdClient(new webpack.optimize.AggressiveMergingPlugin()),

    // We use this so that our generated [chunkhash]'s are only different if
    // the content for our respective chunks have changed.  This optimises
    // our long term browser caching strategy for our client bundle, avoiding
    // cases where browsers end up having to download all the client chunks
    // even though 1 or 2 may have only changed.
    ifProdClient(new WebpackDigestHash()),

    // Extract chunk hashes into separate file
    ifProdClient(new ChunkManifestPlugin({
      filename: 'manifest.json',
      manifestVariable: 'CHUNK_MANIFEST',
    })),

    // Optimize lodash bundles when importing. Works together with Babel plugin.
    // See: https://github.com/lodash/lodash-webpack-plugin#feature-sets
    ifProd(new LodashModuleReplacementPlugin()),

    // Each key passed into DefinePlugin is an identifier.
    // The values for each key will be inlined into the code replacing any
    // instances of the keys that are found.
    // If the value is a string it will be used as a code fragment.
    // If the value isn’t a string, it will be stringified (including functions).
    // If the value is an object all keys are removeEmpty the same way.
    // If you prefix typeof to the key, it’s only removeEmpty for typeof calls.
    new webpack.DefinePlugin({
      'process.env.TARGET': JSON.stringify(target),
      'process.env.MODE': JSON.stringify(mode),

      // NOTE: The NODE_ENV key is especially important for production
      // builds as React relies on process.env.NODE_ENV for optimizations.
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),

      'process.env.APP_ROOT': JSON.stringify(path.resolve(root)),

      // All the below items match the config items in our .env file. Go
      // to the .env_example for a description of each key.
      'process.env.SERVER_PORT': JSON.stringify(process.env.SERVER_PORT),
      'process.env.CLIENT_DEVSERVER_PORT': JSON.stringify(process.env.CLIENT_DEVSERVER_PORT),

      'process.env.DISABLE_SSR': process.env.DISABLE_SSR,

      'process.env.SERVER_BUNDLE_OUTPUT_PATH': JSON.stringify(process.env.SERVER_BUNDLE_OUTPUT_PATH),
      'process.env.CLIENT_BUNDLE_OUTPUT_PATH': JSON.stringify(process.env.CLIENT_BUNDLE_OUTPUT_PATH),
      'process.env.CLIENT_BUNDLE_ASSETS_FILENAME': JSON.stringify(process.env.CLIENT_BUNDLE_ASSETS_FILENAME),
      'process.env.CLIENT_BUNDLE_HTTP_PATH': JSON.stringify(process.env.CLIENT_BUNDLE_HTTP_PATH),
      'process.env.CLIENT_BUNDLE_CACHE_MAXAGE': JSON.stringify(process.env.CLIENT_BUNDLE_CACHE_MAXAGE),
    }),

    // Generates a JSON file containing a map of all the output files for
    // our webpack bundle.  A necessisty for our server rendering process
    // as we need to interogate these files in order to know what JS/CSS
    // we need to inject into our HTML.
    ifClient(
      new AssetsPlugin({
        filename: process.env.CLIENT_BUNDLE_ASSETS_FILENAME,
        path: path.resolve(root, process.env.CLIENT_BUNDLE_OUTPUT_PATH),
        prettyPrint: true,
      })
    ),

    // Assign the module and chunk ids by occurrence count. Ids that are
    // used often get lower (shorter) ids. This make ids predictable.
    // This is a requirement for permanant caching on servers.
    ifProdClient(new webpack.optimize.OccurrenceOrderPlugin(true)),

    // Effectively fake all 'file-loader' files with placeholders on server side
    ifServer(new webpack.NormalModuleReplacementPlugin(/\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|webm|mp4|mp3|ogg|html|pdf)$/, 'node-noop')),

    // We don't want webpack errors to occur during development as it will
    // kill our dev servers.
    ifDev(new webpack.NoErrorsPlugin()),

    // We need this plugin to enable hot module reloading for our dev server.
    ifDevClient(new webpack.HotModuleReplacementPlugin()),

    // Ensure only 1 file is output for the development bundles. This makes it
    // much easer for us to clear the module cache when reloading the server +
    // it helps with making hot module reloading more reliable.
    ifDev(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })),

    // Adds options to all of our loaders.
    ifDev(
      new webpack.LoaderOptionsPlugin({
        // Indicates to our loaders that they should minify their output
        // if they have the capability to do so.
        minimize: false,

        // Indicates to our loaders that they should enter into debug mode
        // should they support it.
        debug: true,

        // Pass options for PostCSS
        options: {
          postcss: getPostCSSConfig(webpack, {}),
          context: root,
        },
      })
    ),

    // Adds options to all of our loaders.
    ifProd(
      new webpack.LoaderOptionsPlugin({
        // Indicates to our loaders that they should minify their output
        // if they have the capability to do so.
        minimize: true,

        // Indicates to our loaders that they should enter into debug mode
        // should they support it.
        debug: false,

        // Pass options for PostCSS
        options: {
          postcss: getPostCSSConfig(webpack, {}),
          context: root,
        },
      })
    ),

    // JS Minification for client
    // See: https://phabricator.babeljs.io/T6858
    ifProdClient(
      // Uglify does not work with ES6. Therefor we can only use it for ES5 transpiled
      // client bundles right now.
      // See: https://github.com/mishoo/UglifyJS2/issues/448
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        sourceMap: true,
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      })

      // Alternative using Babel based compressor. Currently increases built-time by 10sec (=250%)
      // of the timing produced by Uglify.
      // new BabiliPlugin()
    ),

    // This is a production client so we will extract our CSS into
    // CSS files.
    ifProdClient(
      new ExtractTextPlugin({
        filename: '[name]-[contenthash:base62:8].css',
        allChunks: true,
      })
    ),
  ])
}

export default createPlugins

import path from 'path'
import dotenv from 'dotenv'
// builtinModules is an array of builtin modules fetched from the running Node.js version
import builtinModules from 'builtin-modules'

import {
  ifElse,
  ifIsFile,
  removeEmpty,
  removeEmptyKeys,
} from './util'

import createPlugins from './createPlugins'
import createJsRules from './createJsRules'
import createCssRules from './createCssRules'
import createOtherRules from './createOtherRules'

// Using more modern approach of hashing than 'webpack-md5-hash'. Somehow the SHA256 version
// ('webpack-sha-hash') does not correctly work based (produces different hashes for same content).
// This is basically a replacement of md5 with the loader-utils implementation which also supports
// shorter generated hashes based on base62 encoding instead of hex.

import esModules from './Modules'


const builtInSet = new Set(builtinModules)

// - 'helmet' uses some look with require which are not solvable with webpack
// - 'express' also uses some dynamic requires
// - 'commonmark' breaks babili compression right now: https://github.com/babel/babili/issues/115
// - 'encoding' uses dynamic iconv loading
// - 'node-pre-gyp' native code module helper
// - 'iltorb' brotli compression wrapper for NodeJS
// - 'node-zopfli' native Zopfli implementation
const problematicCommonJS = new Set(['helmet', 'express', 'commonmark', 'encoding', 'node-pre-gyp', 'iltorb', 'node-zopfli'])

// @see https://github.com/motdotla/dotenv
dotenv.config()


function isLoaderSpecificFile(request) {
  return Boolean(/\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|webm|ico|mp4|mp3|ogg|html|pdf|swf|css|scss|sass|sss|less)$/.exec(request))
}

function ConfigFactory(target, mode) {
  process.env.NODE_ENV = mode
  process.env.BABEL_ENV = mode
  /* --------------- environment variables ------------------- */
  /* --------------------------------------------------------- */
  /* eslint-disable no-unused-vars */
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
  const ifDevServer = ifElse(isDev && isServer)
  const ifProdClient = ifElse(isProd && isClient)
  const ifProdServer = ifElse(isProd && isServer)
  /* eslint-enable */

  return ({
    // We need to state that we are targetting 'node' for our server bundle.
    target: ifServer('node', 'web'),
    // Define our entry chunks for our bundle.
    entry: removeEmptyKeys({
      main: removeEmpty([
        ifDevClient('react-hot-loader/patch'),
        ifDevClient(`webpack-hot-middleware/client?reload=true&path=http://localhost:${process.env.CLIENT_DEVSERVER_PORT}/__webpack_hmr`),
        ifIsFile(`./src/${target}/index.js`),
      ]),

      vendor: ifProdClient(ifIsFile(`./src/${target}/vendor.js`)),
    }),

    output: {
      // The dir in which our bundle should be output.
      path: path.resolve(root, isClient ? process.env.CLIENT_BUNDLE_OUTPUT_PATH : process.env.SERVER_BUNDLE_OUTPUT_PATH),
      // The filename format for our bundle's entries.
      filename: ifProdClient('[name]-[chunkhash].js', '[name].js'),
      chunkFilename: ifProdClient('chunk-[name]-[chunkhash].js', 'chunk-[name].js'),

      // Prefixes every line of the source in the bundle with this string.
      sourcePrefix: '',

      // This is the web path under which our webpack bundled output should
      // be considered as being served from.
      publicPath: ifDev(
        // As we run a seperate server for our client and server bundles we
        // need to use an absolute http path for our assets public path.
        `http://localhost:${process.env.CLIENT_DEVSERVER_PORT}${process.env.CLIENT_BUNDLE_HTTP_PATH}`,

        // Otherwise we expect our bundled output to be served from this path.
        process.env.CLIENT_BUNDLE_HTTP_PATH
      ),
      // When in server mode we will output our bundle as a commonjs2 module.
      libraryTarget: ifServer('commonjs2', 'var'),
    },

    // We have to set this to be able to use these items when executing a
    // server bundle. Otherwise strangeness happens, like __dirname resolving
    // to '/'. There is no effect on our client bundle.
    node: {
      __dirname: true,
      __filename: true,
    },

    // What information should be printed to the console
    stats: {
      colors: true,
      reasons: true,
      hash: true,
      version: true,
      timings: true,
      chunks: true,
      chunkModules: true,
      cached: true,
      cachedAssets: true,
    },

    // This is not the file cache, but the runtime cache.
    // The reference is used to speed-up rebuilds in one execution e.g. via watcher
    // Note: But is has to share the same configuration as the cache is not config aware.
    // cache: cache,

    // Capture timing information for each module.
    // Analyse tool: http://webpack.github.io/analyse
    profile: false,

    // Report the first error as a hard error instead of tolerating it.
    bail: isProd,

    // Anything listed in externals will not be included in our bundle.
    /* eslint-disable curly */
    externals: removeEmpty([
      ifServer(function (context, request, callback) { // eslint-disable-line
        const basename = request.split('/')[0]

        // Externalize built-in modules
        if (builtInSet.has(basename))
          return callback(null, `commonjs ${request}`)

        // Keep care that problematic common-js code is external
        if (problematicCommonJS.has(basename))
          return callback(null, `commonjs ${request}`)

        // Ignore inline files
        if (basename.charAt(0) === '.')
          return callback()

        // But inline all es2015 modules
        if (esModules.has(basename))
          return callback()

        // Inline all files which are dependend on Webpack loaders e.g. CSS, images, etc.
        if (isLoaderSpecificFile(request))
          return callback()

        // In all other cases follow the user given preference
        return callback(null, `commonjs ${request}`)
      }),
    ]),

    resolve: {
      // Enable new module/jsnext:main field for requiring files
      // Defaults: https://webpack.github.io/docs/configuration.html#resolve-packagemains
      mainFields: ifServer(
        ['module', 'jsnext:main', 'webpack', 'main'],
        ['module', 'jsnext:main', 'webpack', 'browser', 'web', 'browserify', 'main']
      ),

      // These extensions are tried when resolving a file.
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.es5', '.es6', '.es7', '.es', '.json'],
    },

    plugins: createPlugins(target, mode),
    module: {
      rules: removeEmpty([
        ...createJsRules(target, mode),
        ...createOtherRules(target, mode),
        ...createCssRules(target, mode)]),
    },

    // See also: https://webpack.github.io/docs/configuration.html#devtool
    // and http://webpack.github.io/docs/build-performance.html#sourcemaps
    // All 'module*' and 'cheap' variants do not seem to work with this kind
    // of setup where we have loaders involved. Even simple console messages jump
    // to the wrong location in these cases.
    devtool: ifProd('source-map', 'eval-source-map'),
  }) // ----------------------------------------------------------------- return ends
}

export default ConfigFactory


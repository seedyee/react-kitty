import os from 'os'
import path from 'path'
// An array of builtin modules fetched from the running Node.js version
import builtinModules from 'builtin-modules'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import dotenv from 'dotenv'

import applyPlugins from './applyPlugins'
import { ifElse, removeEmpty, removeEmptyKeys, merge, ifIsFile } from './util'

// Using more modern approach of hashing than 'webpack-md5-hash'. Somehow the SHA256 version
// ('webpack-sha-hash') does not correctly work based (produces different hashes for same content).
// This is basically a replacement of md5 with the loader-utils implementation which also supports
// shorter generated hashes based on base62 encoding instead of hex.

import esModules from './Modules'

import BabelConfigClient from '../config/babel.es'
import BabelConfigNode from '../config/babel.node'

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
  return Boolean(/\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|webm|ico|mp4|mp3|ogg|pdf|swf|css|scss|sass|sss|less)$/.exec(request))
}

/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */

function ConfigFactory(target, mode) {
  process.env.NODE_ENV = mode
  process.env.BABEL_ENV = mode
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
  const ifProdServer = ifElse(isProd && isServer)

  const projectId = path.basename(root)
  const isVerbose = true

  return {
    // We need to state that we are targetting 'node' for our server bundle.
    target: ifServer('node', 'web'),

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
      hash: isVerbose,
      version: isVerbose,
      timings: true,
      chunks: isVerbose,
      chunkModules: isVerbose,
      cached: isVerbose,
      cachedAssets: isVerbose,
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

    /* eslint-disable-en curly */

    // See also: https://webpack.github.io/docs/configuration.html#devtool
    // and http://webpack.github.io/docs/build-performance.html#sourcemaps
    // All 'module*' and 'cheap' variants do not seem to work with this kind
    // of setup where we have loaders involved. Even simple console messages jump
    // to the wrong location in these cases.
    devtool: ifProd('source-map', 'eval-source-map'),

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
      path: path.resolve(
        root,
        isClient ? process.env.CLIENT_BUNDLE_OUTPUT_PATH : process.env.SERVER_BUNDLE_OUTPUT_PATH
      ),

      // The filename format for our bundle's entries.
      filename: ifProdClient(
        // We include a hash for client caching purposes. Including a unique
        // has for every build will ensure browsers always fetch our newest
        // bundle.
        '[name]-[chunkhash].js',

        // We want a determinable file name when running our server bundles,
        // as we need to be able to target our server start file from our
        // npm scripts. We don't care about caching on the server anyway.
        // We also want our client development builds to have a determinable
        // name for our hot reloading client bundle server.
        '[name].js'
      ),
      chunkFilename: ifProdClient(
        'chunk-[name]-[chunkhash].js',
        'chunk-[name].js'
      ),

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

    plugins: applyPlugins(target, mode),
    module: {
      rules: removeEmpty([
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

            ifServer(BabelConfigNode),
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

        // Font file references etc.
        {
          test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf)$/,
          loader: 'file-loader',
          query: {
            name: ifProdClient('file-[hash:base62:8].[ext]', '[name].[ext]'),
          },
        },

        // CSS
        merge({ test: /\.css$/ },

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
          })

        ),
      ]),
    },
  }
}

export default ConfigFactory

import { ifElse } from './util'

const createOtherRules = (target, mode) => {
  const isProd = mode === 'production'
  const isClient = target === 'client'
  const ifProdClient = ifElse(isProd && isClient)

  return [
    // Font file references etc.
    {
      test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|html|pdf)$/,
      loader: 'file-loader',
      query: { name: ifProdClient('file-[hash:base62:8].[ext]', '[name].[ext]') },
    },
  ]
}

export default createOtherRules

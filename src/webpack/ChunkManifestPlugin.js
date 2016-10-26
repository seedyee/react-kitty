/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-param-reassign */
import { RawSource } from 'webpack-sources'

export default function ChunkManifestPlugin(options = {}) {
  this.manifestFilename = options.filename || 'manifest.json'
  this.manifestVariable = options.manifestVariable || 'webpackManifest'
}

ChunkManifestPlugin.prototype.constructor = ChunkManifestPlugin
ChunkManifestPlugin.prototype.apply = function (compiler) {
  const manifestFilename = this.manifestFilename
  const manifestVariable = this.manifestVariable
  let oldChunkFilename

  compiler.plugin('this-compilation', function (compilation) {
    const mainTemplate = compilation.mainTemplate
    mainTemplate.plugin('require-ensure', function (_, chunk, hash) {
      const filename = this.outputOptions.chunkFilename || this.outputOptions.filename
      let chunkManifest

      if (filename) {
        chunkManifest = [chunk].reduce(function registerChunk(manifest, c) {
          if (c.id in manifest) return manifest

          if (c.hasRuntime()) {
            manifest[c.id] = undefined
          } else {
            manifest[c.id] = mainTemplate.applyPluginsWaterfall('asset-path', filename, {
              hash: hash, // eslint-disable-line
              chunk: c,
            })
          }
          return c.chunks.reduce(registerChunk, manifest)
        }, {})
        oldChunkFilename = this.outputOptions.chunkFilename
        this.outputOptions.chunkFilename = '__CHUNK_MANIFEST__'
        // mark as asset for emitting
        compilation.assets[manifestFilename] = new RawSource(JSON.stringify(chunkManifest))
      }

      return _
    })
  })

  compiler.plugin('compilation', function (compilation) {
    compilation.mainTemplate.plugin('require-ensure', function (_, chunk, hash, chunkIdVar) {
      if (oldChunkFilename) {
        this.outputOptions.chunkFilename = oldChunkFilename
      }

      return _.replace('\'__CHUNK_MANIFEST__\'',
        'window[\'' + manifestVariable + '\'][' + chunkIdVar + ']') // eslint-disable-line
    })
  })
}

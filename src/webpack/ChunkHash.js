/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-param-reassign */

import { getHashDigest } from 'loader-utils'

function compareModules(a, b) {
  if (a.resource < b.resource) {
    return -1
  }
  if (a.resource > b.resource) {
    return 1
  }
  return 0
}

function getModuleSource(module) {
  const source = module.source || {}
  return source.value || ''
}

function concatenateSource(result, moduleSource) {
  return result + moduleSource
}

function WebpackHashDigest() {

}

const hashType = 'sha256'
const digestType = 'base62'
const digestLength = 8

WebpackHashDigest.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('chunk-hash', function (chunk, chunkHash) {
      const source = chunk.modules.sort(compareModules).map(getModuleSource).reduce(concatenateSource, '') // we provide an initialValue in case there is an empty module source. Ref: http://es5.github.io/#x15.4.4.21

      const generatedHash = getHashDigest(source, hashType, digestType, digestLength)
      chunkHash.digest = function () {
        return generatedHash
      }
    })
  })
}

export default WebpackHashDigest

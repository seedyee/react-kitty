import path from 'path'
import rimraf from 'rimraf'
import webpack from 'webpack'
import series from 'async/series'
import gutil from 'gulp-util'
import fse from 'fs-extra'

import ConfigFactory from '../webpack/ConfigFactory'

export default function build() {
  const buildFolderClient = path.resolve('build', 'client')
  const buildFolderServer = path.resolve('build', 'server')

  series([
    (callback) => {
      // Remove all content but keep the directory so that
      // if you're in it, you don't end up in Trash
      rimraf(`${buildFolderClient}/*`, callback)
    },
    (callback) => {
      // Remove all content but keep the directory so that
      // if you're in it, you don't end up in Trash
      rimraf(`${buildFolderServer}/*`, callback)
    },
    (callback) => {
      console.log('Creating a production build for client...')
      webpack(ConfigFactory('client', 'production')).run((err, stats) => {
        if (err) {
          console.error('Failed to create a production build for client:')
          console.error(err.message || err)
          process.exit(1)
        }

        console.log('- Done')
        console.log('')

        gutil.log(stats.toString({
          children: false,
          chunks: false,
          colors: true,
        }))

        const jsonStats = stats.toJson()
        fse.writeJsonSync(path.resolve(buildFolderClient, 'stats.json'), jsonStats)
        callback()
      })
    },
    (callback) => {
      console.log('Creating a production build for server...')
      webpack(ConfigFactory('server', 'production')).run((err, stats) => {
        if (err) {
          console.error('Failed to create a production build for client:')
          console.error(err.message || err)
          process.exit(1)
        }

        console.log('- Done')
        console.log('')

        gutil.log(stats.toString({
          children: false,
          chunks: false,
          colors: true,
        }))

        const jsonStats = stats.toJson()
        fse.writeJsonSync(path.resolve(buildFolderServer, 'stats.json'), jsonStats)
        callback()
      })
    },
  ])
}

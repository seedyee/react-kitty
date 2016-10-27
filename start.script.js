import build from './src/scripts/build'
import start from './src/scripts/start'

const script = process.argv[2]
const args = process.argv.slice(3)

switch (script) {
  case 'build':
    build(args)
    break

  case 'start':
    start(args)
    break

  case null:
  case undefined:
    console.log('No script name given!')
    break

  default:
    console.log(`Unknown script '${script}'!`)
    break
}

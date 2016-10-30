import { readdirSync } from 'fs'
import { resolve } from 'path'
import { readJsonSync } from 'fs-extra'

const root = 'node_modules'
const modules = new Set()

const nodePackages = readdirSync(root).filter((dirname) => dirname.charAt(0) !== '.')

let json
nodePackages.forEach((pkg) => {
  try {
    json = readJsonSync(resolve(root, pkg, 'package.json'))
  } catch (ex) {
    console.log(ex)
    return
  }
  if (json.module || json.style || json['jsnext:main']) {
    modules.add(pkg)
  }
})

export default modules

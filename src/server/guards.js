import fs from 'fs'

export function fileExists(filePath, message) { // eslint-disable-line import/prefer-default-export
  if (!fs.existsSync(filePath)) {
    throw new Error(message)
  }
}

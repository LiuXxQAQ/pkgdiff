import { gitCommandList } from './command'
import { execute } from './execute'
import { loadPackageJson } from './packageJson'

export function readJSON(commitHash: string) {
  return JSON.parse(
    execute(() => gitCommandList.getFileContent(commitHash, 'package.json')),
  )
}

export function loadPackage(commitHash: string) {
  return loadPackageJson(commitHash)
}

import { gitCommandList } from './command'
import { execute } from './execute'

function getChangedDependencies(
  currentPackageJson: Record<string, Record<string, string>>,
  previousPackageJson: Record<string, Record<string, string>>,
) {
  const currentDependencies = currentPackageJson.dependencies || {}
  const currentDevDependencies = currentPackageJson.devDependencies || {}
  const previousDependencies = previousPackageJson.dependencies || {}
  const previousDevDependencies = previousPackageJson.devDependencies || {}

  const allDependencies = new Set([
    ...Object.keys(currentDependencies),
    ...Object.keys(currentDevDependencies),
    ...Object.keys(previousDependencies),
    ...Object.keys(previousDevDependencies),
  ])

  return Array.from(allDependencies)
    .map((dep: string) => {
      const currentVersion = currentDependencies[dep] || currentDevDependencies[dep] || 'N/A'
      const previousVersion = previousDependencies[dep] || previousDevDependencies[dep] || 'N/A'

      return {
        dep,
        currentVersion,
        previousVersion,
        changed: currentVersion !== previousVersion,
      }
    })
    .filter(({ changed }) => changed)
}

function getPackageJson(commitHash: string) {
  const packageJson = execute(() => gitCommandList.getFileContent(commitHash, 'package.json'))
  return JSON.parse(packageJson)
}

export {
  getChangedDependencies,
  getPackageJson,
}

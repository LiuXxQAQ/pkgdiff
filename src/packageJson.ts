import { parseDependencies } from './dependencies'
import { readJSON } from './package'
import type { Dependency, PackageMeta } from './type'

const depsFields = ['dependencies', 'devDependencies'] as const

export function loadPackageJson(commitHash: string): PackageMeta {
  const packageJson = readJSON(commitHash)
  const deps: Dependency[] = []
  for (const field of depsFields) {
    deps.push(...parseDependencies(packageJson, field))
  }

  return {
    name: packageJson.name,
    license: packageJson.license,
    deps,
  }
}

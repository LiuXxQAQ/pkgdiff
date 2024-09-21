import type { Dependency, DevType, Row } from './type'

export function parseDependencies(packageJson: any, type: DevType): Dependency[] {
  const dependencies: Record<string, string> = packageJson[type]
  return Object.entries(dependencies || {}).map(([name, version]) => parseDependency(name, version, type))
}

export function parseDependency(name: string, version: string, type: DevType): Dependency {
  return { name, version, type }
}

export function getChangedDependencies(
  currentDependencies: Dependency[],
  previousDependencies: Dependency[],
): Row[] {
  const reMap = (deps: Dependency[]) => deps.reduce((acc, dep) => {
    acc[dep.name] = dep
    return acc
  }, {} as Record<string, Dependency>)

  const currentDeps = reMap(currentDependencies)
  const previousDeps = reMap(previousDependencies)

  const allDeps = new Set([
    ...Object.keys(currentDeps),
    ...Object.keys(previousDeps),
  ])

  return Array.from(allDeps).map((name) => {
    const current = currentDeps[name]
    const previous = previousDeps[name]
    return {
      name,
      currentVersion: current?.version || 'N/A',
      previousVersion: previous?.version || 'N/A',
      type: current?.type || 'N/A',
      changed: current?.version !== previous?.version,
    }
  },
  ).filter(row => row.changed)
}

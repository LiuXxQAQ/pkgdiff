export type DevType = 'dependencies' | 'devDependencies'

export interface Dependency {
  name: string
  version: string
  type: DevType
}

export interface PackageMeta {
  name: string
  license: string
  deps: Dependency[]
}

export interface Row {
  name: string
  currentVersion: string
  previousVersion: string
  type: DevType
}

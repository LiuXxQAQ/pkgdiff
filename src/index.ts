/* eslint-disable no-console */
import process from 'node:process'
import { cac } from 'cac'
import {
  getCurrentBranch,
  getFirstCommitHashFromBranch,
  getLastCommitHashFromBranch,
} from './git'
import { getChangedDependencies, getPackageJson } from './packageJson'

function run() {
  const cli = cac('pkgdiff')

  cli
    .option('-b, --branch <branch>', 'Branch to compare against')
    .option('-f, --first-commit <hash>', 'First commit hash to compare against')
    .option('-l, --last-commit <hash>', 'Last commit hash to compare against')
    .option('-verbose', 'Verbose mode')

  const {
    branch,
    firstCommit,
    lastCommit,
    verbose,
  } = cli.parse().options

  const currentBranch = branch || getCurrentBranch()
  const firstCommitHash = firstCommit || getFirstCommitHashFromBranch(currentBranch)
  const lastCommitHash = lastCommit || getLastCommitHashFromBranch(currentBranch)

  const currentPackageJson = getPackageJson(lastCommitHash)
  const previousPackageJson = getPackageJson(firstCommitHash)

  if (!currentPackageJson || !previousPackageJson) {
    console.error('No package.json to compare.')
    process.exit(1)
  }

  const changedDependencies = getChangedDependencies(currentPackageJson, previousPackageJson)

  if (changedDependencies.length === 0) {
    console.log('No dependencies changed.')
    process.exit(0)
  }

  if (verbose) {
    logVerbose(changedDependencies)
  }
}

function logVerbose(changedDependencies: ReturnType<typeof getChangedDependencies>) {
  for (const { dep, currentVersion, previousVersion } of changedDependencies) {
    console.log('-'.repeat(80))
    console.log(`Dependency: ${dep}`)
    console.log(`Current version: ${currentVersion}`)
    console.log(`Previous version: ${previousVersion}`)
  }
}

run()

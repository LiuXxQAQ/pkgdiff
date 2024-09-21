/* eslint-disable no-console */
import process from 'node:process'
import { cac } from 'cac'
import {
  getCurrentBranch,
  getFirstCommitHashFromBranch,
  getLastCommitHashFromBranch,
} from './git'
import { getChangedDependencies } from './dependencies'
import { loadPackage } from './package'
import { TableLogger } from './logger'

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

  const { deps: currentDeps } = loadPackage(lastCommitHash)
  const { deps: previousDeps } = loadPackage(firstCommitHash)

  if (
    currentDeps.length === 0 || previousDeps.length === 0
  ) {
    console.log('No dependencies found.')
    process.exit(0)
  }

  const changedDependencies = getChangedDependencies(currentDeps, previousDeps)

  if (changedDependencies.length === 0) {
    console.log('No dependencies changed.')
    process.exit(0)
  }

  const logger = new TableLogger(changedDependencies)

  if (verbose) {
    logger.logVerbose()
  }
  else {
    logger.log()
  }
}

run()

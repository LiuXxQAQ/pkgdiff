/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import process from 'node:process'
import { cac } from 'cac'

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
  const firstCommitHash = firstCommit || getFirstCommitHash(currentBranch)
  const lastCommitHash = lastCommit || getLastCommitHash(currentBranch)
  console.log(`Comparing from commit: ${firstCommitHash}`)
  console.log(`Comparing to commit: ${lastCommitHash}`)

  console.log(`Comparing against branch: ${currentBranch}`)

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

function getCurrentBranch() {
  let branch: string
  try {
    branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim()
  }
  catch (error) {
    console.error('Error getting current branch')
    console.error(error)
    process.exit(1)
  }
  return branch
}

function getFirstCommitHash(branch: string) {
  let hash: string
  try {
    hash = execSync(`git rev-list --reverse ${branch} HEAD | head -n 1`, { encoding: 'utf-8' }).trim()
  }
  catch (error) {
    console.error('Error getting first commit hash')
    console.error(error)
    process.exit(1)
  }
  return hash
}

function getLastCommitHash(branch: string) {
  let hash: string
  try {
    hash = execSync(`git rev-list ${branch} HEAD | head -n 1`, { encoding: 'utf-8' }).trim()
  }
  catch (error) {
    console.error('Error getting last commit hash')
    console.error(error)
    process.exit(1)
  }
  return hash
}

function getPackageJson(commitHash: string) {
  let packageJson: string
  try {
    packageJson = execSync(`git show ${commitHash}:package.json`, { encoding: 'utf-8' }).trim()
  }
  catch (error) {
    console.error('Error getting package.json')
    console.error(error)
    process.exit(1)
  }
  return JSON.parse(packageJson)
}

run()

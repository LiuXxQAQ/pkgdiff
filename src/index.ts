/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import process from 'node:process'
import { cac } from 'cac'

const cli = cac('pkgdiff')

cli
  .option('-b, --branch <branch>', 'Branch to compare against')
  .option('-f, --first-commit <hash>', 'First commit hash to compare against')
  .option('-l, --last-commit <hash>', 'Last commit hash to compare against')

const { branch, firstCommit, lastCommit } = cli.parse().options

const currentBranch = branch || getCurrentBranch()
const firstCommitHash = firstCommit || getFirstCommitHash(currentBranch)
const lastCommitHash = lastCommit || getLastCommitHash(currentBranch)

console.log(`Comparing against branch: ${currentBranch}`)

function getCurrentBranch() {
  let branch: string
  try {
    branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim()
  }
  catch (error) {
    console.error('Error getting current branch')
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
    process.exit(1)
  }
  return hash
}

function getLastCommitHash(branch: string) {
  let hash: string
  try {
    hash = execSync(`git rev-list --reverse ${branch} HEAD | head -n 1`, { encoding: 'utf-8' }).trim()
  }
  catch (error) {
    console.error('Error getting last commit hash')
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
    process.exit(1)
  }
  return JSON.parse(packageJson)
}

const currentPackageJson = getPackageJson(lastCommitHash)
const previousPackageJson = getPackageJson(firstCommitHash)

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

const changedDependencies = Array.from(allDependencies)
  .map((dep) => {
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

for (const { dep, currentVersion, previousVersion } of changedDependencies) {
  console.log('-'.repeat(80))
  console.log(`Dependency: ${dep}`)
  console.log(`Current version: ${currentVersion}`)
  console.log(`Previous version: ${previousVersion}`)
}

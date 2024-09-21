import { gitCommandList } from './command'
import { execute } from './execute'

function getCurrentBranch(): string {
  return execute(() => gitCommandList.getCurrentBranch())
}

function getFirstCommitHashFromBranch(branch: string): string {
  return execute(() => gitCommandList.getFirstCommitHashFromBranch(branch))
}

function getLastCommitHashFromBranch(branch: string): string {
  return execute(() => gitCommandList.getLastCommitHashFromBranch(branch))
}

export {
  getCurrentBranch,
  getFirstCommitHashFromBranch,
  getLastCommitHashFromBranch,
}

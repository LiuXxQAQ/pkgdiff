export const gitCommandList = {
  getCurrentBranch: () => 'git rev-parse --abbrev-ref HEAD',
  getFirstCommitHashFromBranch: (branch: string) => `git rev-list --reverse ${branch} HEAD | head -n 1`,
  getLastCommitHashFromBranch: (branch: string) => `git rev-list ${branch} HEAD | head -n 1`,
  getFileContent: (commitHash: string, filePath: string) => `git show ${commitHash}:${filePath}`,
} as const

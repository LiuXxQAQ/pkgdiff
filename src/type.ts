export interface GitCommandList {
  readonly getCurrentBranch: () => string
  readonly getFirstCommitHashFromBranch: (branch: string) => string
  readonly getLastCommitHashFromBranch: (branch: string) => string
  readonly getFileContent: (commitHash: string, filePath: string) => string
}

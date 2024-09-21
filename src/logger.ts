/* eslint-disable no-console */
import c from 'picocolors'
import type { Row } from './type'

export class TableLogger {
  rows: Row[] = []

  constructor(rows: Row[]) {
    this.rows = rows
  }

  log() {
    for (const row of this.rows) {
      console.log(this.normalRow(row))
    }
  }

  logVerbose() {
    for (const row of this.rows) {
      console.log(this.verboseRow(row))
    }
  }

  private verboseRow(row: Row) {
    const { name, currentVersion, previousVersion, type } = row
    return `${c.bold(name)} ${c.dim(`(${type})`)} ${c.red(previousVersion)} -> ${c.green(currentVersion)}`
  }

  private normalRow(row: Row) {
    const { name, currentVersion, previousVersion } = row
    return `${c.bold(name)} ${c.red(previousVersion)} -> ${c.green(currentVersion)}`
  }
}

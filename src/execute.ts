import { execSync } from 'node:child_process'
import process from 'node:process'

export function execute(command: () => string): string {
  try {
    return execSync(command(), { encoding: 'utf-8' }).trim()
  }
  catch (error) {
    console.error(`Error executing command: ${command}`)
    console.error(error)
    process.exit(1)
  }
}

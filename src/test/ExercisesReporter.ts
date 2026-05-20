import { DefaultReporter } from 'vitest/node'

const isTTY = process.stdout.isTTY
const G = (s: string) => isTTY ? `\x1b[32m${s}\x1b[0m` : s
const R = (s: string) => isTTY ? `\x1b[31m${s}\x1b[0m` : s
const D = (s: string) => isTTY ? `\x1b[2m${s}\x1b[0m` : s

export default class ExercisesReporter extends DefaultReporter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override printTestModule(testModule: any) {
    if (!testModule.task.name.endsWith('exercises.test.ts')) {
      super.printTestModule(testModule)
      return
    }

    const moduleState = testModule.state()
    if (moduleState === 'queued' || moduleState === 'pending') {
      return
    }

    for (const child of testModule.children) {
      if (child.type !== 'suite') continue

      const tests = collectTests(child)
      if (tests.length === 0) continue

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nFail = tests.filter(t => t.result().state === 'failed').length
      const dur = Math.round(
        tests.reduce((sum, test) => sum + (test.result().duration ?? 0), 0)
      )
      const displayName = getDisplayName(child.name)
      const icon = nFail ? R('✗') : G('✓')
      const durStr = dur > 0 ? G(` ${dur}`) + D('ms') : ''
      this.log(` ${icon} ${displayName} ${D(`(${tests.length} tests)`)}${durStr}`)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function collectTests(task: any): any[] {
  const tests = []

  for (const child of task.children ?? []) {
    if (child.type === 'test') {
      tests.push(child)
      continue
    }

    if (child.type === 'suite') {
      tests.push(...collectTests(child))
    }
  }

  return tests
}

function getDisplayName(name: string) {
  const fileName = name.split(' > ')[0]
  if (/^src\/pages\/.+\/(Component|utils)\.test\.tsx?$/.test(fileName)) {
    return fileName
  }

  return name
}

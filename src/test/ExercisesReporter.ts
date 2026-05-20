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

    for (const child of testModule.children) {
      if (child.type !== 'suite') continue
      const m = child.name.match(/^Exercise: (.+?) > (.+)$/)
      if (!m) continue
      const displayPath = `src/pages/${m[1]}/${m[2]}`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tests = Array.from(child.children.allTests()) as any[]
      const nFail = tests.filter(t => t.result().state === 'failed').length
      const dur = Math.round(child.task.result?.duration ?? 0)
      const icon = nFail ? R('✗') : G('✓')
      const durStr = dur > 0 ? G(` ${dur}`) + D('ms') : ''
      this.log(` ${icon} ${displayPath} ${D(`(${tests.length} tests)`)}${durStr}`)
    }
  }
}

import { describe, expect, it } from 'vitest'
import { generatePasswords } from '../src/composables/useGenerator'
import type { GeneratorOptions } from '../src/types'

const perfOptions: GeneratorOptions = {
  length: 128,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: false,
  excludeChars: '',
  passwordCount: 20,
  autoGenerate: false,
}

describe('performance', () => {
  it('генерирует 20 паролей длиной 128 символов быстро', () => {
    const start = performance.now()
    generatePasswords(perfOptions)
    const elapsed = performance.now() - start

    expect(elapsed).toBeLessThan(10)
  })
})

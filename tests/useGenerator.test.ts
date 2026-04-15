import { describe, expect, it } from 'vitest'
import type { GeneratorOptions } from '../src/types'
import { generatePassword } from '../src/composables/useGenerator'

const base: GeneratorOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: false,
  excludeChars: '',
  passwordCount: 1,
  autoGenerate: false,
}

describe('useGenerator', () => {
  it('генерирует пароль нужной длины', () => {
    expect(generatePassword(base)).toHaveLength(16)
  })

  it('учитывает исключённые символы', () => {
    const password = generatePassword({ ...base, excludeChars: 'abcXYZ1!' })
    for (const char of 'abcXYZ1!') expect(password).not.toContain(char)
  })

  it('исключает похожие символы', () => {
    const password = generatePassword({ ...base, excludeSimilar: true, includeSymbols: false, length: 64 })
    for (const char of '0Oo1lI') expect(password).not.toContain(char)
  })

  it('обрабатывает крайние длины', () => {
    expect(generatePassword({ ...base, length: 4 })).toHaveLength(4)
    expect(generatePassword({ ...base, length: 128 })).toHaveLength(128)
  })
})

import { describe, expect, it } from 'vitest'
import { getEntropy, getStrengthLevel } from '../src/composables/useStrength'
import type { GeneratorOptions } from '../src/types'

const make = (partial: Partial<GeneratorOptions>): GeneratorOptions => ({
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: false,
  includeSymbols: false,
  excludeSimilar: false,
  excludeChars: '',
  passwordCount: 1,
  autoGenerate: false,
  ...partial,
})

describe('useStrength', () => {
  it('определяет уровень надёжности', () => {
    expect(getStrengthLevel(make({ length: 5, includeLowercase: false }))).toBe('very-weak')
    expect(getStrengthLevel(make({ length: 8 }))).toBe('weak')
    expect(getStrengthLevel(make({ length: 12, includeNumbers: true }))).toBe('medium')
    expect(getStrengthLevel(make({ length: 18, includeNumbers: true, includeSymbols: true }))).toBe('strong')
    expect(getStrengthLevel(make({ length: 24, includeNumbers: true, includeSymbols: true }))).toBe('very-strong')
  })

  it('считает энтропию', () => {
    const entropy = getEntropy(make({ length: 16, includeNumbers: true, includeSymbols: true }))
    expect(entropy).toBeGreaterThan(100)
    expect(entropy).toBeLessThan(110)
  })
})

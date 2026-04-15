import type { GeneratorOptions, StrengthLevel } from '../types'
import { buildAlphabet } from './useGenerator'

export const getEntropy = (options: GeneratorOptions) => {
  const { alphabet } = buildAlphabet(options)
  if (!alphabet.length) return 0
  return options.length * Math.log2(alphabet.length)
}

export const getStrengthLevel = (options: GeneratorOptions): StrengthLevel => {
  const enabledSets = [
    options.includeUppercase,
    options.includeLowercase,
    options.includeNumbers,
    options.includeSymbols,
  ].filter(Boolean).length

  if (options.length < 6 || enabledSets <= 1) return 'very-weak'
  if (options.length <= 9 && enabledSets <= 2) return 'weak'
  if (options.length <= 15 && enabledSets <= 3) return 'medium'
  if (options.length <= 19 && enabledSets <= 4) return 'strong'
  if (options.length >= 20 && enabledSets === 4) return 'very-strong'

  return 'strong'
}

export const strengthMeta: Record<StrengthLevel, { label: string; color: string; width: string }> = {
  'very-weak': { label: 'Очень слабый', color: 'bg-red-500', width: 'w-1/5' },
  weak: { label: 'Слабый', color: 'bg-orange-500', width: 'w-2/5' },
  medium: { label: 'Средний', color: 'bg-yellow-400', width: 'w-3/5' },
  strong: { label: 'Сильный', color: 'bg-lime-400', width: 'w-4/5' },
  'very-strong': { label: 'Очень сильный', color: 'bg-green-500', width: 'w-full' },
}

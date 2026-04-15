import { LOWERCASE, NUMBERS, SIMILAR, SYMBOLS, UPPERCASE } from '../constants/charsets'
import type { GeneratorOptions } from '../types'

type CharsetConfig = {
  enabled: boolean
  chars: string
}

const RANDOM_POOL_SIZE = 256
const randomPool = new Uint32Array(RANDOM_POOL_SIZE)
let randomPoolIndex = RANDOM_POOL_SIZE

const nextRandomUint32 = () => {
  if (randomPoolIndex >= RANDOM_POOL_SIZE) {
    crypto.getRandomValues(randomPool)
    randomPoolIndex = 0
  }

  const value = randomPool[randomPoolIndex]
  randomPoolIndex += 1
  return value
}

const getRandomInt = (max: number) => {
  if (max <= 0) throw new Error('max must be positive')
  const maxUint = 0x100000000
  const limit = maxUint - (maxUint % max)

  while (true) {
    const value = nextRandomUint32()
    if (value < limit) return value % max
  }
}

const uniqueChars = (text: string) => [...new Set(text)].join('')

const removeChars = (source: string, charsToRemove: string) => {
  if (!charsToRemove) return source
  const removeSet = new Set(charsToRemove.split(''))
  return source
    .split('')
    .filter((char) => !removeSet.has(char))
    .join('')
}

const shuffle = (chars: string[]) => {
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = getRandomInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
}

const resolveCharsets = (options: GeneratorOptions) => {
  const excluded = uniqueChars(`${options.excludeChars}${options.excludeSimilar ? SIMILAR : ''}`)

  const sets: CharsetConfig[] = [
    { enabled: options.includeUppercase, chars: removeChars(UPPERCASE, excluded) },
    { enabled: options.includeLowercase, chars: removeChars(LOWERCASE, excluded) },
    { enabled: options.includeNumbers, chars: removeChars(NUMBERS, excluded) },
    { enabled: options.includeSymbols, chars: removeChars(SYMBOLS, excluded) },
  ].filter((set) => set.enabled)

  return sets
}

export const buildAlphabet = (options: GeneratorOptions) => {
  const sets = resolveCharsets(options)
  const alphabet = uniqueChars(sets.map((set) => set.chars).join(''))
  return { sets, alphabet }
}

export const generatePassword = (options: GeneratorOptions) => {
  const { sets, alphabet } = buildAlphabet(options)

  if (!sets.length || !alphabet.length) {
    throw new Error('Выберите хотя бы один набор символов')
  }

  if (options.length < sets.length) {
    throw new Error('Длина пароля меньше количества активных наборов')
  }

  const chars: string[] = []

  for (const set of sets) {
    chars.push(set.chars[getRandomInt(set.chars.length)])
  }

  while (chars.length < options.length) {
    chars.push(alphabet[getRandomInt(alphabet.length)])
  }

  shuffle(chars)

  return chars.join('')
}

export const generatePasswords = (options: GeneratorOptions) => {
  return Array.from({ length: options.passwordCount }, () => generatePassword(options))
}

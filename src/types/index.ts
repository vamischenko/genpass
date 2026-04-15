export interface GeneratorOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeChars: string
  passwordCount: 1 | 5 | 10 | 20
  autoGenerate: boolean
}

export type StrengthLevel = 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong'

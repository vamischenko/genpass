import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { GeneratorOptions } from '../types'

const STORAGE_KEY = 'password-generator-settings'

export const defaultOptions: GeneratorOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false,
  excludeSimilar: false,
  excludeChars: '',
  passwordCount: 1,
  autoGenerate: true,
}

const normalize = (value: unknown): GeneratorOptions => {
  const parsed = value as Partial<GeneratorOptions>
  return {
    ...defaultOptions,
    ...parsed,
    length: Math.min(128, Math.max(4, Number(parsed?.length ?? defaultOptions.length))),
    passwordCount: [1, 5, 10, 20].includes(Number(parsed?.passwordCount))
      ? (Number(parsed?.passwordCount) as 1 | 5 | 10 | 20)
      : 1,
  }
}

const loadOptions = (): GeneratorOptions => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { ...defaultOptions }

  try {
    return normalize(JSON.parse(raw))
  } catch {
    return { ...defaultOptions }
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const options = ref<GeneratorOptions>(loadOptions())

  const hasEnabledCharset = computed(() => {
    return (
      options.value.includeUppercase ||
      options.value.includeLowercase ||
      options.value.includeNumbers ||
      options.value.includeSymbols
    )
  })

  const updateOptions = (payload: Partial<GeneratorOptions>) => {
    options.value = { ...options.value, ...payload }
  }

  const resetOptions = () => {
    options.value = { ...defaultOptions }
  }

  watch(
    options,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  return { options, hasEnabledCharset, updateOptions, resetOptions }
})

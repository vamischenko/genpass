import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useSettingsStore } from '../src/stores/settings'

describe('settings store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('сохраняет настройки в localStorage', async () => {
    const store = useSettingsStore()
    store.updateOptions({ length: 20 })
    await nextTick()
    expect(JSON.parse(localStorage.getItem('password-generator-settings') || '{}').length).toBe(20)
  })

  it('сбрасывает настройки', () => {
    const store = useSettingsStore()
    store.updateOptions({ includeSymbols: true })
    store.resetOptions()
    expect(store.options.includeSymbols).toBe(false)
  })
})

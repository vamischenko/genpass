import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordOutput from '../src/components/PasswordOutput.vue'
import StrengthIndicator from '../src/components/StrengthIndicator.vue'

const options = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false,
  excludeSimilar: false,
  excludeChars: '',
  passwordCount: 1 as const,
  autoGenerate: false,
}

describe('components', () => {
  it('PasswordOutput переключает скрытие', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn() } })
    const wrapper = mount(PasswordOutput, { props: { password: 'Secret123' } })
    expect(wrapper.find('input').element.value).toBe('•••••••••')
    await wrapper.findAll('button')[2].trigger('click')
    expect(wrapper.emitted('update:hidden')?.[0]).toEqual([false])
  })

  it('StrengthIndicator отображает уровень', () => {
    const wrapper = mount(StrengthIndicator, { props: { options } })
    expect(wrapper.text()).toContain('Энтропия')
  })
})

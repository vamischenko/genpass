<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import PasswordList from './components/PasswordList.vue'
import PasswordOutput from './components/PasswordOutput.vue'
import PasswordSettings from './components/PasswordSettings.vue'
import StrengthIndicator from './components/StrengthIndicator.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { generatePasswords } from './composables/useGenerator'
import { useClipboard } from './composables/useClipboard'
import { useSettingsStore } from './stores/settings'

const store = useSettingsStore()
const passwords = ref<string[]>([])
const hidden = ref(true)
const error = ref('')
const { copyText } = useClipboard()
const githubUrl = 'https://github.com/vamischenko/genpass'

const password = computed(() => passwords.value[0] ?? '')

const generate = () => {
  error.value = ''
  try {
    passwords.value = generatePasswords(store.options)
  } catch (err) {
    passwords.value = []
    error.value = err instanceof Error ? err.message : 'Ошибка генерации'
  }
}

const canGenerate = computed(() => store.hasEnabledCharset)

const isTypingElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  return ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable
}

const onGlobalKeydown = async (event: KeyboardEvent) => {
  if (isTypingElement(event.target)) return

  if (event.ctrlKey && event.key.toLowerCase() === 'c' && password.value) {
    event.preventDefault()
    await copyText(password.value)
    return
  }

  if ((event.key === 'Enter' || event.key === ' ') && canGenerate.value) {
    event.preventDefault()
    generate()
  }
}

watch(
  () => store.options,
  () => {
    if (store.options.autoGenerate && canGenerate.value) generate()
  },
  { deep: true },
)

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
  if (canGenerate.value) generate()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<template>
  <main class="mx-auto min-h-screen max-w-3xl space-y-4 p-4" aria-live="polite">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Генератор паролей</h1>
      <ThemeToggle />
    </header>

    <PasswordOutput v-model:hidden="hidden" :password="password" @regenerate="generate" />
    <StrengthIndicator :options="store.options" />

    <section class="rounded-xl border p-4">
      <h2 class="mb-2 text-lg font-semibold">Количество паролей</h2>
      <div class="flex gap-2">
        <button
          v-for="count in [1, 5, 10, 20]"
          :key="count"
          class="h-11 rounded border px-3 py-1"
          :class="{ 'bg-gray-900 text-white dark:bg-gray-200 dark:text-black': store.options.passwordCount === count }"
          type="button"
          @click="store.updateOptions({ passwordCount: count as 1 | 5 | 10 | 20 })"
        >
          {{ count }}
        </button>
      </div>
    </section>

    <PasswordSettings />

    <div class="flex flex-wrap gap-2">
      <button
        class="rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        type="button"
        aria-label="Сгенерировать новый пароль"
        :disabled="!canGenerate"
        @click="generate"
      >
        Сгенерировать
      </button>
      <button class="h-11 rounded border px-4 py-2" type="button" @click="store.resetOptions()">Сбросить настройки</button>
    </div>

    <p v-if="!canGenerate" class="text-red-600">Выберите хотя бы один набор символов.</p>
    <p v-if="error" class="text-red-600">{{ error }}</p>

    <PasswordList :passwords="passwords" />

    <footer class="space-y-2 pt-4 text-sm text-gray-600 dark:text-gray-300">
      <p>Пароли генерируются только в браузере и не отправляются в сеть.</p>
      <a :href="githubUrl" class="underline underline-offset-2" target="_blank" rel="noreferrer">
        GitHub проекта
      </a>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const key = 'password-generator-theme'
const dark = ref(false)

const label = computed(() => (dark.value ? 'Тёмная' : 'Светлая'))

const applyTheme = () => {
  document.documentElement.classList.toggle('dark', dark.value)
}

onMounted(() => {
  const stored = localStorage.getItem(key)
  dark.value = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme()
})

watch(dark, (value) => {
  localStorage.setItem(key, value ? 'dark' : 'light')
  applyTheme()
})
</script>

<template>
  <button
    class="h-11 rounded-lg border px-3 py-2 text-sm"
    type="button"
    :aria-pressed="dark"
    aria-label="Переключить тему"
    @click="dark = !dark"
  >
    {{ label }} тема
  </button>
</template>

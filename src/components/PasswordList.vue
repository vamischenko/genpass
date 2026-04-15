<script setup lang="ts">
import { useClipboard } from '../composables/useClipboard'

const props = defineProps<{ passwords: string[] }>()
const { copyText } = useClipboard()

const copyAll = async () => {
  await copyText(props.passwords.join('\n'))
}
</script>

<template>
  <section v-if="passwords.length > 1" class="space-y-3 rounded-xl border p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Список паролей</h2>
      <button class="h-11 rounded border px-3 py-1" type="button" @click="copyAll">Скопировать все</button>
    </div>
    <ul class="space-y-2">
      <li v-for="password in passwords" :key="password" class="flex items-center gap-2">
        <code class="grow overflow-auto rounded bg-gray-100 p-2 dark:bg-gray-800">{{ password }}</code>
        <button class="h-11 rounded border px-2 py-1" type="button" @click="copyText(password)">Копировать</button>
      </li>
    </ul>
  </section>
</template>

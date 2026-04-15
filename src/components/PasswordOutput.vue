<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard } from '../composables/useClipboard'

const props = withDefaults(defineProps<{ password: string; hidden?: boolean }>(), {
  hidden: true,
})
const emit = defineEmits<{ regenerate: []; 'update:hidden': [boolean] }>()

const hidden = computed({
  get: () => props.hidden,
  set: (value: boolean) => emit('update:hidden', value),
})
const { copied, copyText } = useClipboard()
const displayPassword = computed(() => (hidden.value ? '•'.repeat(props.password.length) : props.password))
</script>

<template>
  <section class="space-y-3 rounded-xl border p-4">
    <h2 class="text-lg font-semibold">Результат</h2>
    <div class="flex gap-2">
      <input
        :value="displayPassword"
        readonly
        aria-label="Сгенерированный пароль"
        class="h-11 w-full overflow-x-auto rounded border px-3 py-2 font-mono whitespace-nowrap"
      />
      <button class="h-11 rounded border px-3" type="button" aria-label="Перегенерировать пароль" @click="emit('regenerate')">↻</button>
    </div>
    <div class="flex flex-wrap gap-2">
      <button class="h-11 rounded border px-4 py-2" type="button" aria-label="Скопировать пароль" @click="copyText(props.password)">
        {{ copied ? 'Скопировано!' : 'Копировать' }}
      </button>
      <button class="h-11 rounded border px-4 py-2" type="button" :aria-label="hidden ? 'Показать пароль' : 'Скрыть пароль'" @click="hidden = !hidden">
        {{ hidden ? 'Показать' : 'Скрыть' }}
      </button>
    </div>
  </section>
</template>

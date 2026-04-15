<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'

const store = useSettingsStore()

const options = computed(() => store.options)
const enabledCount = computed(
  () =>
    [
      options.value.includeUppercase,
      options.value.includeLowercase,
      options.value.includeNumbers,
      options.value.includeSymbols,
    ].filter(Boolean).length,
)

const isLocked = (key: 'includeUppercase' | 'includeLowercase' | 'includeNumbers' | 'includeSymbols') =>
  enabledCount.value === 1 && options.value[key]

const toggle = (key: 'includeUppercase' | 'includeLowercase' | 'includeNumbers' | 'includeSymbols') => {
  if (isLocked(key)) return
  store.updateOptions({ [key]: !options.value[key] })
}
</script>

<template>
  <section class="space-y-4 rounded-xl border p-4">
    <h2 class="text-lg font-semibold">Настройки</h2>

    <label class="flex flex-col gap-2">
      <span>Длина пароля: {{ options.length }}</span>
      <input
        :value="options.length"
        class="h-11"
        type="range"
        min="4"
        max="128"
        aria-label="Длина пароля"
        @input="store.updateOptions({ length: Number(($event.target as HTMLInputElement).value) })"
      />
      <input
        :value="options.length"
        class="w-24 rounded border px-2 py-1"
        type="number"
        min="4"
        max="128"
        @input="store.updateOptions({ length: Math.min(128, Math.max(4, Number(($event.target as HTMLInputElement).value))) })"
      />
    </label>

    <p id="charset-hint" class="text-sm text-gray-600 dark:text-gray-300">
      Минимум один набор символов должен оставаться включённым.
    </p>

    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <label class="flex items-center gap-2">
        <input
          :checked="options.includeUppercase"
          :disabled="isLocked('includeUppercase')"
          type="checkbox"
          aria-describedby="charset-hint"
          @change="toggle('includeUppercase')"
        />
        A-Z
      </label>
      <label class="flex items-center gap-2">
        <input
          :checked="options.includeLowercase"
          :disabled="isLocked('includeLowercase')"
          type="checkbox"
          aria-describedby="charset-hint"
          @change="toggle('includeLowercase')"
        />
        a-z
      </label>
      <label class="flex items-center gap-2">
        <input
          :checked="options.includeNumbers"
          :disabled="isLocked('includeNumbers')"
          type="checkbox"
          aria-describedby="charset-hint"
          @change="toggle('includeNumbers')"
        />
        0-9
      </label>
      <label class="flex items-center gap-2">
        <input
          :checked="options.includeSymbols"
          :disabled="isLocked('includeSymbols')"
          type="checkbox"
          aria-describedby="charset-hint"
          @change="toggle('includeSymbols')"
        />
        !@#...
      </label>
    </div>

    <label class="block">
      <input
        :checked="options.excludeSimilar"
        type="checkbox"
        @change="store.updateOptions({ excludeSimilar: !options.excludeSimilar })"
      />
      Исключить похожие символы (0, O, o, 1, l, I)
    </label>

    <label class="flex flex-col gap-1">
      <span>Исключить символы</span>
      <input
        :value="options.excludeChars"
        class="rounded border px-2 py-1"
        type="text"
        @input="store.updateOptions({ excludeChars: ($event.target as HTMLInputElement).value })"
      />
    </label>

    <label class="flex items-center gap-2">
      <input
        :checked="options.autoGenerate"
        type="checkbox"
        @change="store.updateOptions({ autoGenerate: !options.autoGenerate })"
      />
      Автогенерация при изменениях
    </label>
  </section>
</template>

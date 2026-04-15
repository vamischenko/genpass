<script setup lang="ts">
import { computed } from 'vue'
import type { GeneratorOptions } from '../types'
import { getEntropy, getStrengthLevel, strengthMeta } from '../composables/useStrength'

const props = defineProps<{ options: GeneratorOptions }>()

const level = computed(() => getStrengthLevel(props.options))
const meta = computed(() => strengthMeta[level.value])
const entropy = computed(() => getEntropy(props.options).toFixed(1))
</script>

<template>
  <section class="space-y-2" aria-label="Индикатор надёжности">
    <div class="h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
      <div class="h-2 rounded transition-all" :class="[meta.color, meta.width]" />
    </div>
    <p class="text-sm" :title="`Энтропия = длина × log2(алфавит)`">
      {{ meta.label }} · Энтропия: {{ entropy }} бит
    </p>
  </section>
</template>

import { ref } from 'vue'

export const useClipboard = () => {
  const copied = ref(false)

  const copyText = async (value: string) => {
    await navigator.clipboard.writeText(value)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 1500)
  }

  return { copied, copyText }
}

<script setup lang="ts">
defineProps<{
  modelValue: string
  length?: number
  ariaLabel?: string
}>()

const emit = defineEmits<{
  (eventname: 'update:modelValue', value: string): void
  (eventname: 'finish'): void
}>()
</script>

<template>
  <div role="group" :aria-label="ariaLabel">
    <v-otp-input
      :model-value="modelValue"
      length="6"
      type="number"
      @update:model-value="emit('update:modelValue', $event)"
      @finish="emit('finish')"
    />
  </div>
</template>

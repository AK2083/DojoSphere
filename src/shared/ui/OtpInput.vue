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
  <v-otp-input
    :model-value="modelValue"
    length="6"
    type="number"
    v-bind="{ 'aria-label': ariaLabel }"
    @update:model-value="emit('update:modelValue', $event)"
    @finish="emit('finish')"
  />
</template>

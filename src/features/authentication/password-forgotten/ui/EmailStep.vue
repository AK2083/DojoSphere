<script setup lang="ts">
import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'

type ValidationRule = string | ((value: unknown) => boolean | string)

defineProps<{
  email: string
  rules: ValidationRule[]
  labelTextField: string
  ariaLabelEmail: string
  placeholder: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (eventname: 'update:email', value: string): void
  (eventname: 'valid-change', value: boolean): void
}>()

const form = ref<VForm | null>(null)
const isValid = ref(false)

async function handleSubmit() {
  if (!form.value) return

  const result = await form.value?.validate()
  if (!result?.valid) return
}

watch(isValid, (val) => {
  emit('valid-change', val)
})
</script>

<template>
  <v-form ref="form" v-model="isValid" @submit.prevent="handleSubmit">
    <v-text-field
      :model-value="email"
      @update:model-value="emit('update:email', $event)"
      density="default"
      :rules="rules"
      :label="labelTextField"
      :placeholder="placeholder"
      clearable
      autocomplete="email"
      required
      :aria-label="ariaLabelEmail"
    />
  </v-form>
</template>

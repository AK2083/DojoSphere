<script setup lang="ts">
import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { mdiEmailFastOutline } from '@mdi/js'

type ValidationRule = string | ((value: unknown) => boolean | string)

defineProps<{
  stepTitle: string
  stepSubTitle: string
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
    <v-card class="pa-4" variant="tonal">
      <template #title>
        <div class="v-card-title" id="otpTitle">{{ stepTitle }}</div>
      </template>

      <template #subtitle>
        <div class="v-card-subtitle" id="otpDescription">{{ stepSubTitle }}</div>
      </template>

      <template #prepend>
        <v-avatar color="blue-darken-2">
          <v-icon :icon="mdiEmailFastOutline" size="30"></v-icon>
        </v-avatar>
      </template>

      <v-card-text>
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
          autofocus
          :aria-label="ariaLabelEmail"
        />
      </v-card-text>
    </v-card>
  </v-form>
</template>

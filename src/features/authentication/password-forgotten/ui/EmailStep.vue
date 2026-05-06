<script setup lang="ts">
import { mdiEmailFastOutline } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useEmailStepForm } from '../model/email-step/use-form'

const { t } = useTranslation()

const emit = defineEmits<{
  (event: 'success', email: string): void
}>()
const validModel = defineModel<boolean>('valid', { default: false })
const loadingModel = defineModel<boolean>('loading', { default: false })

const emailStep = useEmailStepForm({
  loadingModel,
  onSuccess: (email: string) => emit('success', email)
})

defineExpose({
  submit
})

async function submit(): Promise<boolean> {
  return emailStep.submit()
}
</script>

<template>
  <v-form :ref="emailStep.setFormRef" v-model="validModel" validate-on="input">
    <v-card class="pa-4" variant="tonal">
      <template #title>
        <div class="v-card-title" id="otpTitle">
          {{ t(translationKeys.steps.email.title) }}
        </div>
      </template>

      <template #subtitle>
        <div class="v-card-subtitle" id="otpDescription">
          {{ t(translationKeys.steps.email.description) }}
        </div>
      </template>

      <template #prepend>
        <v-avatar color="blue-darken-2">
          <v-icon :icon="mdiEmailFastOutline" size="30"></v-icon>
        </v-avatar>
      </template>

      <v-card-text>
        <v-text-field
          v-model="emailStep.email.value"
          :rules="emailStep.translatedEmailRules"
          :label="t(translationKeys.steps.email.label)"
          :placeholder="t(translationKeys.steps.email.placeholder)"
          :aria-label="t(translationKeys.steps.email.ariaLabel)"
          clearable
          autocomplete="email"
          required
          autofocus
        />
      </v-card-text>
    </v-card>
  </v-form>
</template>

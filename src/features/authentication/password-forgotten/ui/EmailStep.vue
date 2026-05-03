<script setup lang="ts">
import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { mdiEmailFastOutline } from '@mdi/js'
import { emailRules, mapRule, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useEmailStep } from '../model/use-email-step'

const { t } = useTranslation()
const emailStep = useEmailStep()
const translatedEmailRules = emailRules.map((rule) => mapRule(rule, t))

const emit = defineEmits<{
  (event: 'update:valid', value: boolean): void
  (event: 'success', email: string): void
}>()

defineExpose({
  submit
})

const form = ref<VForm | null>(null)
const valid = ref(false)

async function submit(): Promise<boolean> {
  if (!form.value) {
    return false
  }

  const result = await form.value.validate()

  if (!result.valid) {
    return false
  }

  const success = await emailStep.submit()

  if (!success) {
    return false
  }

  emit('success', emailStep.email.value)

  return true
}

watch(valid, (value: boolean) => {
  emit('update:valid', value)
})
</script>

<template>
  <v-form ref="form" v-model="valid" validate-on="input">
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
          :rules="translatedEmailRules"
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

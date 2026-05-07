<script setup lang="ts">
import { toRef } from 'vue'
import { mdiEmailOutline } from '@mdi/js'
import { useTranslation } from '@shared/lib'
import OtpInput from '@shared/ui/OtpInput.vue'

import translationKeys from '../i18n/keys'
import { useOtpStepForm } from '../model/otp-step/use-form'
import ResendOneTimePassword from './ResendOneTimePassword.vue'

const { t } = useTranslation()

const props = defineProps<{
  email: string
}>()

const emit = defineEmits<{
  (e: 'success', token: string): void
}>()

const validModel = defineModel<boolean>('valid', { default: false })
const loadingModel = defineModel<boolean>('loading', { default: false })

const otpStep = useOtpStepForm({
  emailModel: toRef(props, 'email'),
  validModel,
  loadingModel,
  onSuccess: (token: string) => emit('success', token)
})

defineExpose({
  submit
})

async function submit(): Promise<boolean> {
  return otpStep.submit()
}
</script>

<template>
  <v-alert :text="t(translationKeys.steps.email.successInfo)" :type="'info'" class="mb-2" />
  <v-alert
    v-if="otpStep.error.value"
    :text="t(otpStep.error.value ?? '')"
    :type="'error'"
    class="mt-2"
  />
  <v-card class="pa-4" variant="tonal">
    <template #title>
      <div class="v-card-title" id="otpTitle">
        {{ t(translationKeys.steps.otp.title, { email: props.email }) }}
      </div>
    </template>

    <template #subtitle>
      <div class="v-card-subtitle" id="otpDescription">
        {{ t(translationKeys.steps.otp.description) }}
      </div>
    </template>

    <template #prepend>
      <v-avatar color="blue-darken-2">
        <v-icon :icon="mdiEmailOutline" size="30"></v-icon>
      </v-avatar>
    </template>

    <v-card-text>
      <OtpInput
        :model-value="otpStep.token.value"
        :aria-label="t(translationKeys.steps.otp.ariaLabel)"
        @update:model-value="otpStep.token.value = $event"
      ></OtpInput>
    </v-card-text>
    <v-card-actions>
      <ResendOneTimePassword :email="props.email" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { mdiEmailOutline } from '@mdi/js'
import { useTranslation } from '@shared/lib'
import OtpInput from '@shared/ui/OtpInput.vue'

import translationKeys from '../i18n/keys'
import { useVerifyOtpByRecovery } from '../model/use-recovery-otp-step'

const { t } = useTranslation()
const otpStep = useVerifyOtpByRecovery()

const props = defineProps<{
  email: string
}>()

const emit = defineEmits<{
  (e: 'update:valid', value: boolean): void
  (e: 'success', token: string): void
}>()

defineExpose({
  submit
})

const hasEmail = computed<boolean>(() => props.email.trim().length > 0)

watch(
  () => props.email,
  (value: string) => {
    otpStep.email.value = value
  },
  { immediate: true }
)

watch(
  () => otpStep.token.value,
  (value: string) => {
    emit('update:valid', value.length === 6)
  },
  { immediate: true }
)

async function submit(): Promise<boolean> {
  if (otpStep.token.value.length !== 6) {
    return false
  }

  const success = await otpStep.submit()

  if (!success) {
    return false
  }

  emit('success', otpStep.token.value)

  return true
}
</script>

<template>
  <v-alert
    v-if="otpStep.error.value"
    :text="otpStep.error.value ?? ''"
    :type="'error'"
    class="mt-2"
  />
  <v-card class="pa-4" variant="tonal">
    <template #title>
      <div class="v-card-title" id="otpTitle">{{ t(translationKeys.steps.otp.title) }}</div>
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
      <v-btn
        block
        color="primary"
        variant="text"
        :loading="otpStep.loading.value"
        :disabled="!hasEmail"
        :aria-label="t(translationKeys.steps.otp.resend.ariaResendLabel)"
        @click="() => {}"
      >
        {{ t(translationKeys.steps.otp.resend.resendLabel) }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

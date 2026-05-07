<script setup lang="ts">
import { watch } from 'vue'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useResendOneTimePassword } from '../model/resend-otp/use-resend-one-time-password'

const props = defineProps<{
  email: string
}>()

const { t } = useTranslation()
const resendOtp = useResendOneTimePassword()

watch(
  () => props.email,
  (value: string) => {
    resendOtp.email.value = value
  },
  { immediate: true }
)
</script>

<template>
  <v-btn
    block
    color="primary"
    variant="text"
    :loading="resendOtp.loading.value"
    :disabled="!resendOtp.canResend.value"
    :aria-label="t(translationKeys.steps.otp.resend.ariaResendLabel)"
    @click="resendOtp.resend()"
  >
    {{ t(translationKeys.steps.otp.resend.resendLabel) }}
  </v-btn>
</template>

<script setup lang="ts">
import {
  translationKeysPasswordForgotten,
  useResendOneTimePassword
} from '@features/authentication'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
const resendOtp = useResendOneTimePassword()
</script>

<template>
  <v-btn
    block
    color="primary"
    variant="text"
    :loading="resendOtp.loading.value"
    :disabled="resendOtp.canResend.value"
    :aria-label="t(translationKeysPasswordForgotten.steps.otp.resend.ariaResendLabel)"
    @click="resendOtp.resend()"
  >
    {{ t(translationKeysPasswordForgotten.steps.otp.resend.resendLabel) }}
  </v-btn>
</template>

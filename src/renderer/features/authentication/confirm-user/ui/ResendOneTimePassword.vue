<script setup lang="ts">
import { translationKeys } from '@features/authentication/password-forgotten'
import { useTranslation } from '@shared/lib'

import { useResendOneTimePassword } from '../model/use-resend-one-time-password'

const { t } = useTranslation()
const resendOtp = useResendOneTimePassword()
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

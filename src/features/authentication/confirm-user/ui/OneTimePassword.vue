<script setup lang="ts">
import { translationKeys } from '@features/authentication/password-forgotten'
import { useTranslation } from '@shared/lib'

import { useSendOneTimePassword } from '../model/use-send-one-time-password'

const { t } = useTranslation()
const sendOtp = useSendOneTimePassword()
</script>

<template>
  <v-otp-input
    v-model="sendOtp.token.value"
    length="6"
    type="number"
    :aria-label="t(translationKeys.steps.otp.ariaLabel)"
    @finish="sendOtp.execute()"
  />
  <v-alert
    v-if="sendOtp.errorCode !== null"
    :text="sendOtp.errorCode.value ?? ''"
    type="error"
    class="mt-2"
  ></v-alert>
</template>

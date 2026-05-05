<script setup lang="ts">
import { translationKeys } from '@features/authentication/password-forgotten'
import { useTranslation } from '@shared/lib'

import { useSendOneTimePassword } from '../model/use-send-one-time-password'
import ResendOneTimePassword from './ResendOneTimePassword.vue'

const { t } = useTranslation()
const sendOtp = useSendOneTimePassword()
</script>

<template>
  <v-card
    width="650"
    class="pa-4"
    :title="t(translationKeys.steps.otp.title, { email: sendOtp.email.value })"
    :subtitle="t(translationKeys.steps.otp.description)"
    variant="tonal"
  >
    <v-card-text>
      <v-otp-input
        v-model="sendOtp.token.value"
        length="6"
        type="number"
        :loading="sendOtp.loading.value"
        :aria-label="t(translationKeys.steps.otp.ariaLabel)"
        @finish="sendOtp.execute()"
      />
      <v-alert
        v-if="sendOtp.errorCode !== null"
        :text="sendOtp.errorCode.value ?? ''"
        type="error"
        class="mt-2"
      ></v-alert>
    </v-card-text>
    <v-card-actions>
      <ResendOneTimePassword />
    </v-card-actions>
  </v-card>
</template>

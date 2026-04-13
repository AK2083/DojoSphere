<script setup lang="ts">
import { translationKeysPasswordForgotten, useEmailConfirmation } from '@features/authentication'
import { useTranslation } from '@shared/lib'

const { email, otp, verifyOtp, resendConfirmation, alert, resendLoading } = useEmailConfirmation()
const { t } = useTranslation()
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card
      width="420"
      class="pa-4"
      :title="t(translationKeysPasswordForgotten.steps.otp.title)"
      :subtitle="t(translationKeysPasswordForgotten.steps.otp.description)"
      variant="tonal"
    >
      <v-card-text>
        <v-otp-input
          v-model="otp"
          length="6"
          type="number"
          :aria-label="t(translationKeysPasswordForgotten.steps.otp.ariaLabel)"
          @finish="verifyOtp"
        />
        <v-alert
          v-if="alert !== null"
          :text="t(alert.text)"
          :type="alert.type"
          class="mt-2"
        ></v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          color="primary"
          variant="text"
          :loading="resendLoading"
          :disabled="!email"
          :aria-label="t(translationKeysPasswordForgotten.steps.otp.resend.ariaResendLabel)"
          @click="resendConfirmation"
        >
          {{ t(translationKeysPasswordForgotten.steps.otp.resend.resendLabel) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

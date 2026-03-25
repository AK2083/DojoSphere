<script setup lang="ts">
import { translationKeys, useEmailConfirmation } from '@features/authentication'
import { useTranslation } from '@shared/lib'

const {
  email,
  otp,
  verifyOtp,
  resendConfirmation,
  errorCode,
  resendErrorCode,
  resendLoading,
  resendSuccess
} = useEmailConfirmation()
const { t } = useTranslation()
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="420" class="pa-4">
      <v-card-title>{{ t(translationKeys.otp.title) }}</v-card-title>

      <v-card-text>
        <p>{{ t(translationKeys.otp.description) }}</p>

        <v-otp-input
          v-model="otp"
          length="6"
          type="number"
          :aria-label="t(translationKeys.otp.codeAria)"
          @finish="verifyOtp"
        />
        <v-alert v-if="errorCode" :text="t(errorCode)" type="error" class="mt-2"></v-alert>
        <v-alert
          v-if="resendErrorCode"
          :text="t(resendErrorCode)"
          type="error"
          class="mt-2"
        ></v-alert>
        <v-alert
          v-if="resendSuccess"
          :text="t(translationKeys.success.resendMail)"
          type="success"
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
          :aria-label="t(translationKeys.otp.resendMailButton)"
          @click="resendConfirmation"
        >
          {{ t(translationKeys.otp.resendMailButton) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

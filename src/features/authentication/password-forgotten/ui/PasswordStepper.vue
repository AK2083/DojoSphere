<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiCancel, mdiCheck } from '@mdi/js'
import { emailRules, mapRule, passwordRules, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import EmailStep from './EmailStep.vue'
import NewPasswordStep from './NewPasswordStep.vue'
import OtpStep from './OtpStep.vue'

const router = useRouter()
const { t } = useTranslation()
const step = ref<'0' | '1' | '2' | '3'>('0')

// Email-Step 1
const email = ref('')
const isEmailValid = ref(false)
const translatedEmailRules = emailRules.map((rule) => mapRule(rule, t))

// Otp-Step 2
const otp = ref<string | null>('')
const otpError = ref<string | null>('')
const resendSuccess = ref(false)
const isOtpValid = ref(false)

function resendOtp() {}

// NewPassword-Step 3
const password = ref('')
const confirmedPassword = ref('')
const translatedPasswordRules = passwordRules.map((rule) => mapRule(rule, t))
const isPasswordConfirmationValid = ref(false)

// Stepper
function goNextStep() {
  switch (step.value) {
    case '0':
      step.value = '1'
      break
    case '1':
      step.value = '2'
      break
    case '2':
      step.value = '3'
      break
    default:
      step.value = '0'
  }
}

function cancel() {
  router.push({ name: 'login' })
}
</script>

<template>
  <v-card-text>
    <v-stepper v-model="step" alt-labels elevation="0" show-actions style="border: none">
      <v-stepper-header>
        <v-stepper-item value="0">
          <template #title>{{ t(translationKeys.steps.email.title) }}</template>
        </v-stepper-item>

        <v-divider />

        <v-stepper-item value="1">
          <template #title>{{ t(translationKeys.steps.otp.title) }}</template>
        </v-stepper-item>

        <v-divider />

        <v-stepper-item value="2">
          <template #title>{{ t(translationKeys.steps.newPassword.title) }}</template>
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item value="0">
          <EmailStep
            :email="email"
            :rules="translatedEmailRules"
            :labelTextField="t(translationKeys.steps.email.label)"
            :ariaLabelEmail="t(translationKeys.steps.email.ariaLabel)"
            :placeholder="t(translationKeys.steps.email.placeholder)"
            :loading="false"
            @valid-change="isEmailValid = $event"
            @update:email="email = $event"
          />
        </v-stepper-window-item>

        <v-stepper-window-item value="1">
          <OtpStep
            :step-title="t(translationKeys.steps.otp.title)"
            :otp="otp"
            :otpAriaLabel="t(translationKeys.steps.otp.ariaLabel)"
            :resendLabel="t(translationKeys.steps.otp.resend.resendLabel)"
            :resendAriaLabel="t(translationKeys.steps.otp.resend.ariaResendLabel)"
            :isMailAvailable="true"
            :resendSuccessLabel="t(translationKeys.steps.otp.resend.success)"
            :showResendSuccessLabel="resendSuccess"
            :otpErrorLabel="otpError ?? ''"
            :showOtpError="otpError ? true : false"
            :loading="false"
            @valid-change="isOtpValid = $event"
            @update:otp="otp = $event"
            @clear-error="otpError = null"
            @resend="resendOtp"
          />
        </v-stepper-window-item>

        <v-stepper-window-item value="2">
          <NewPasswordStep
            :password="password"
            :repeatedPassword="confirmedPassword"
            :rules="translatedPasswordRules"
            :labelPassword="t(translationKeys.steps.newPassword.passwordLabel)"
            :ariaLabelPassword="t(translationKeys.steps.newPassword.ariaPasswordLabel)"
            :labelRepeatedPassword="t(translationKeys.steps.newPassword.newPasswordLabel)"
            :ariaLabelRepeatedPassword="t(translationKeys.steps.newPassword.ariaNewPasswordLabel)"
            @update:password="password = $event"
            @update:repassword="confirmedPassword = $event"
            @valid-change="isPasswordConfirmationValid = $event"
          />
        </v-stepper-window-item>
      </v-stepper-window>

      <template #actions>
        <div class="d-flex justify-space-between mt-4">
          <v-btn
            :prepend-icon="mdiCancel"
            :aria-label="t(translationKeys.ariaCancelLabel)"
            variant="text"
            @click="cancel"
          >
            {{ t(translationKeys.cancelLabel) }}
          </v-btn>

          <v-btn
            variant="text"
            :aria-label="t(translationKeys.ariaNextLabel)"
            :prepend-icon="mdiCheck"
            color="primary"
            :disabled="
              (step === '0' && !isEmailValid) ||
              (step === '1' && !isOtpValid) ||
              (step === '2' && !isPasswordConfirmationValid)
            "
            @click="goNextStep"
          >
            {{ t(translationKeys.nextLabel) }}
          </v-btn>
        </div>
      </template>
    </v-stepper>
  </v-card-text>
</template>

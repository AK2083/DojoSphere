<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiCancel, mdiCheck } from '@mdi/js'
import { emailRules, mapRule, passwordRules, useTranslation } from '@shared/lib'

import { translationKeys } from '../i18n/keys'
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
const otpError = ref('')
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
          <template #title>{{ t(translationKeys.resetPassword.steps.email) }}</template>
        </v-stepper-item>

        <v-divider />

        <v-stepper-item value="1">
          <template #title>{{ t(translationKeys.resetPassword.steps.otp) }}</template>
        </v-stepper-item>

        <v-divider />

        <v-stepper-item value="2">
          <template #title>{{ t(translationKeys.resetPassword.steps.newPassword) }}</template>
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item value="0">
          <EmailStep
            :email="email"
            :rules="translatedEmailRules"
            :label-text-field="t(translationKeys.form.mail.title)"
            :aria-label-email="t(translationKeys.form.mail.title)"
            :placeholder="t(translationKeys.form.mail.placeholder)"
            :loading="false"
            @valid-change="isEmailValid = $event"
            @update:email="email = $event"
          />
        </v-stepper-window-item>

        <v-stepper-window-item value="1">
          <OtpStep
            :step-title="t(translationKeys.otp.description)"
            :otp="otp"
            :otp-aria-label="t(translationKeys.otp.codeAria)"
            :resend-aria-label="t(translationKeys.resetPassword.resendOtpButton)"
            :is-mail-available="true"
            :resend-label="t(translationKeys.resetPassword.resendOtpButton)"
            :resend-success-label="t(translationKeys.success.resendMail)"
            :show-resend-success-label="resendSuccess"
            :otp-error-label="otpError ?? ''"
            :show-otp-error="otpError ? true : false"
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
            :repeated-password="confirmedPassword"
            :rules="translatedPasswordRules"
            :label-password="t(translationKeys.form.password.title)"
            :aria-label-password="t(translationKeys.form.password.title)"
            :label-repeated-password="t(translationKeys.resetPassword.password.repeatTitle)"
            :aria-label-repeated-password="t(translationKeys.resetPassword.password.repeatTitle)"
            @update:password="password = $event"
            @update:repassword="confirmedPassword = $event"
            @valid-change="isPasswordConfirmationValid = $event"
          />
        </v-stepper-window-item>
      </v-stepper-window>

      <template #actions>
        <div class="d-flex justify-space-between mt-4">
          <v-btn :prepend-icon="mdiCancel" variant="text" @click="cancel">Abbrechen</v-btn>

          <v-btn
            variant="text"
            :prepend-icon="mdiCheck"
            color="primary"
            :disabled="
              (step === '0' && !isEmailValid) ||
              (step === '1' && !isOtpValid) ||
              (step === '2' && !isPasswordConfirmationValid)
            "
            @click="goNextStep"
          >
            Weiter
          </v-btn>
        </div>
      </template>
    </v-stepper>
  </v-card-text>
</template>

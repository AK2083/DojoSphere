<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiCancel, mdiCheck } from '@mdi/js'
import { emailRules, mapRule, passwordRules, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useEmailStep } from '../model/use-email-step'
import { useVerifyOtpByRecovery } from '../model/use-recovery-otp-step'
import EmailStep from './EmailStep.vue'
import NewPasswordStep from './NewPasswordStep.vue'
import OtpStep from './OtpStep.vue'

const router = useRouter()
const { t } = useTranslation()
const step = ref<'0' | '1' | '2' | '3'>('0')

// Email-Step 1
const translatedEmailRules = emailRules.map((rule) => mapRule(rule, t))
const {
  email: emailStepEmail,
  loading: emailStepLoading,
  error: emailStepError,
  isValid: emailStepIsValid,
  submit: emailStepSubmit
} = useEmailStep()

// Otp-Step 2
const {
  email: otpStepEmail,
  token: otpStepToken,
  loading: otpStepLoading,
  error: otpStepError,
  isValid: otpStepIsValid,
  submit: otpStepSubmit
} = useVerifyOtpByRecovery()

function resendConfirmation() {}

// NewPassword-Step 3
const password = ref('')
const confirmedPassword = ref('')
const translatedPasswordRules = passwordRules.map((rule) => mapRule(rule, t))
const isPasswordConfirmationValid = ref(false)

async function goNextStep() {
  switch (step.value) {
    case '0':
      const emailStepSuccess = await emailStepSubmit()
      if (!emailStepSuccess) return

      step.value = '1'
      break
    case '1':
      const otpStepSuccess = await otpStepSubmit()
      if (!otpStepSuccess) return

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
        <v-stepper-item value="0" :complete="emailStepIsValid">
          <template #title>{{ t(translationKeys.steps.email.title) }}</template>
        </v-stepper-item>

        <v-divider />

        <v-stepper-item value="1" :complete="otpStepIsValid">
          <template #title>{{ t(translationKeys.steps.otp.title) }}</template>
        </v-stepper-item>

        <v-divider />

        <v-stepper-item value="2" :complete="isPasswordConfirmationValid">
          <template #title>{{ t(translationKeys.steps.newPassword.title) }}</template>
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item value="0">
          <v-alert v-if="false" :text="emailStepError ?? ''" :type="'error'" class="mt-2" />
          <EmailStep
            :step-title="t(translationKeys.steps.email.title)"
            :step-sub-title="t(translationKeys.steps.email.description)"
            :email="emailStepEmail ?? ''"
            :rules="translatedEmailRules"
            :labelTextField="t(translationKeys.steps.email.label)"
            :ariaLabelEmail="t(translationKeys.steps.email.ariaLabel)"
            :placeholder="t(translationKeys.steps.email.placeholder)"
            :loading="emailStepLoading"
            @update:valid="emailStepIsValid = $event"
            @update:email="emailStepEmail = $event"
          />
        </v-stepper-window-item>

        <v-stepper-window-item value="1">
          <v-alert v-if="false" :text="otpStepError ?? ''" :type="'error'" class="mt-2" />
          <OtpStep
            :step-title="t(translationKeys.steps.otp.title)"
            :step-sub-title="t(translationKeys.steps.otp.description)"
            :otp="otpStepToken"
            :otpAriaLabel="t(translationKeys.steps.otp.ariaLabel)"
            :resendLabel="t(translationKeys.steps.otp.resend.resendLabel)"
            :resendAriaLabel="t(translationKeys.steps.otp.resend.ariaResendLabel)"
            :isMailAvailable="!!otpStepEmail"
            :loading="otpStepLoading"
            @update:valid="otpStepIsValid = $event"
            @update:otp="otpStepToken = $event"
            @resend="resendConfirmation"
          />
        </v-stepper-window-item>

        <v-stepper-window-item value="2">
          <v-alert v-if="false" :text="''" :type="'error'" class="mt-2" />
          <NewPasswordStep
            :step-title="t(translationKeys.steps.newPassword.title)"
            :step-sub-title="t(translationKeys.steps.newPassword.description)"
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
              (step === '0' && !emailStepIsValid) ||
              (step === '1' && !otpStepIsValid) ||
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

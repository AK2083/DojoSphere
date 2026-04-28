<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiCancel, mdiCheck } from '@mdi/js'
import { emailRules, mapRule, passwordRules, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useEmailStep } from '../model/use-email-step'
import { useNewPasswordStep } from '../model/use-new-password-step'
import { useVerifyOtpByRecovery } from '../model/use-recovery-otp-step'
import EmailStep from './EmailStep.vue'
import NewPasswordStep from './NewPasswordStep.vue'
import OtpStep from './OtpStep.vue'

const router = useRouter()
const { t } = useTranslation()
const step = ref(0)

// Email-Step 1
const translatedEmailRules = emailRules.map((rule) => mapRule(rule, t))
const emailStep = useEmailStep()

// Otp-Step 2
const otpStep = useVerifyOtpByRecovery()

function resendConfirmation() {}

// NewPassword-Step 3
const newPasswordStep = useNewPasswordStep()

const confirmedPassword = ref('')
const translatedPasswordRules = passwordRules.map((rule) => mapRule(rule, t))

async function goNextStep() {
  switch (step.value) {
    case 0:
      const emailStepSuccess = await emailStep.submit()
      if (!emailStepSuccess) return

      otpStep.email.value = emailStep.email.value

      step.value = 1
      break
    case 1:
      const otpStepSuccess = await otpStep.submit()
      if (!otpStepSuccess) return

      step.value = 2
      break
    case 2:
      const newPasswordStepSuccess = await newPasswordStep.submit()
      if (!newPasswordStepSuccess) return

      step.value = 3
      break
    default:
      step.value = 0
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
        <v-stepper-item value="0" :complete="emailStep.isValid.value">
          <template #title>{{ t(translationKeys.steps.email.title) }}</template>
        </v-stepper-item>

        <v-divider />

        <v-stepper-item value="1" :complete="otpStep.isValid.value">
          <template #title>{{ t(translationKeys.steps.otp.title) }}</template>
        </v-stepper-item>

        <v-divider />

        <v-stepper-item value="2" :complete="newPasswordStep.isValid.value">
          <template #title>{{ t(translationKeys.steps.newPassword.title) }}</template>
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item value="0">
          <v-alert
            v-if="emailStep.error"
            :text="emailStep.error.value ?? ''"
            :type="'error'"
            class="mt-2"
          />
          <EmailStep
            :step-title="t(translationKeys.steps.email.title)"
            :step-sub-title="t(translationKeys.steps.email.description)"
            :email="emailStep.email.value"
            :rules="translatedEmailRules"
            :labelTextField="t(translationKeys.steps.email.label)"
            :ariaLabelEmail="t(translationKeys.steps.email.ariaLabel)"
            :placeholder="t(translationKeys.steps.email.placeholder)"
            :loading="emailStep.loading.value"
            @update:valid="emailStep.isValid.value = $event"
            @update:email="emailStep.email.value = $event"
          />
        </v-stepper-window-item>

        <v-stepper-window-item value="1">
          <v-alert
            v-if="otpStep.error.value"
            :text="otpStep.error.value ?? ''"
            :type="'error'"
            class="mt-2"
          />
          <OtpStep
            :step-title="t(translationKeys.steps.otp.title)"
            :step-sub-title="t(translationKeys.steps.otp.description)"
            :otp="otpStep.token.value"
            :otpAriaLabel="t(translationKeys.steps.otp.ariaLabel)"
            :resendLabel="t(translationKeys.steps.otp.resend.resendLabel)"
            :resendAriaLabel="t(translationKeys.steps.otp.resend.ariaResendLabel)"
            :isMailAvailable="!!emailStep.email.value"
            :loading="otpStep.loading.value"
            @update:valid="otpStep.isValid.value = $event"
            @update:otp="otpStep.token.value = $event"
            @resend="resendConfirmation"
          />
        </v-stepper-window-item>

        <v-stepper-window-item value="2">
          <v-alert
            v-if="newPasswordStep.error.value"
            :text="newPasswordStep.error.value ?? ''"
            :type="'error'"
            class="mt-2"
          />
          <NewPasswordStep
            :step-title="t(translationKeys.steps.newPassword.title)"
            :step-sub-title="t(translationKeys.steps.newPassword.description)"
            :password="newPasswordStep.password.value"
            :repeatedPassword="confirmedPassword"
            :rules="translatedPasswordRules"
            :labelPassword="t(translationKeys.steps.newPassword.passwordLabel)"
            :ariaLabelPassword="t(translationKeys.steps.newPassword.ariaPasswordLabel)"
            :labelRepeatedPassword="t(translationKeys.steps.newPassword.newPasswordLabel)"
            :ariaLabelRepeatedPassword="t(translationKeys.steps.newPassword.ariaNewPasswordLabel)"
            :loading="newPasswordStep.loading.value"
            @update:password="newPasswordStep.password.value = $event"
            @update:repassword="confirmedPassword = $event"
            @update:valid="newPasswordStep.isValid.value = $event"
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
              (step === 0 && !emailStep.isValid.value) ||
              (step === 1 && !otpStep.isValid.value) ||
              (step === 2 && !newPasswordStep.isValid.value)
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

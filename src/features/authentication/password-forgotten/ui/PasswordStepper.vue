<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiCancel, mdiCheck } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import EmailStep from './EmailStep.vue'
import NewPasswordStep from './NewPasswordStep.vue'
import OtpStep from './OtpStep.vue'

const router = useRouter()
const { t } = useTranslation()
const step = ref(0)

// Email-Step 1
const emailStepRef = ref<InstanceType<typeof EmailStep> | null>(null)
const isEmailStepValid = ref(false)

// Otp-Step 2
const otpStepRef = ref<InstanceType<typeof OtpStep> | null>(null)
const otpStepEmail = ref('')
const isOtpStepValid = ref(false)

// NewPassword-Step 3
const newPasswordStepRef = ref<InstanceType<typeof NewPasswordStep> | null>(null)
const isNewPasswordStepValid = ref(false)

function handleSuccess(email: string) {
  otpStepEmail.value = email
}

async function goNextStep() {
  switch (step.value) {
    case 0:
      const emailStepSuccess = await emailStepRef.value?.submit()

      if (emailStepSuccess !== true) {
        return
      }

      step.value = 1
      break
    case 1:
      const otpStepSuccess = await otpStepRef.value?.submit()
      if (!otpStepSuccess) return

      step.value = 2
      break
    case 2:
      const newPasswordStepSuccess = await newPasswordStepRef.value?.submit()
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
        <v-stepper-item :value="0" :complete="isEmailStepValid">
          <template #title>{{ t(translationKeys.steps.email.title) }}</template>
        </v-stepper-item>

        <v-divider />

        <v-stepper-item :value="1" :complete="isOtpStepValid">
          <template #title>{{ t(translationKeys.steps.otp.title) }}</template>
        </v-stepper-item>

        <v-divider />

        <v-stepper-item :value="2" :complete="isNewPasswordStepValid">
          <template #title>{{ t(translationKeys.steps.newPassword.title) }}</template>
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item :value="0">
          <EmailStep ref="emailStepRef" @success="handleSuccess" v-model:valid="isEmailStepValid" />
        </v-stepper-window-item>

        <v-stepper-window-item :value="1">
          <OtpStep ref="otpStepRef" :email="otpStepEmail" @update:valid="isOtpStepValid = $event" />
        </v-stepper-window-item>

        <v-stepper-window-item :value="2">
          <NewPasswordStep
            ref="newPasswordStepRef"
            @update:valid="isNewPasswordStepValid = $event"
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
              (step === 0 && !isEmailStepValid) ||
              (step === 1 && !isOtpStepValid) ||
              (step === 2 && !isNewPasswordStepValid)
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

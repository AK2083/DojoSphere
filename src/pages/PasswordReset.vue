<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { VForm } from 'vuetify/components'
import { translationKeys } from '@features/authentication'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import { emailRules, mapRule, passwordRules, useTranslation } from '@shared/lib'

import ResetPasswordImage from '../features/authentication/assets/Register.webp'

const { t } = useTranslation()
const route = useRoute()
const router = useRouter()

const step = ref<'0' | '1' | '2'>('0')

const emailForm = ref<VForm | null>(null)
const email = ref('')
const otp = ref('')
const passwordForm = ref<VForm | null>(null)
const password = ref('')
const repeatPassword = ref('')

const showPassword = ref(false)
const showRepeatPassword = ref(false)

const otpError = ref<string | null>(null)
const resendLoading = ref(false)
const resendSuccess = ref(false)

const translatedEmailRules = emailRules.map((rule) => mapRule(rule, t))
const translatedPasswordRules = passwordRules.map((rule) => mapRule(rule, t))
const translatedRepeatPasswordRules = computed(() => [
  ...translatedPasswordRules,
  (value?: string) => value === password.value || t(translationKeys.resetPassword.password.mismatch)
])

const passwordsMatch = computed(() => password.value === repeatPassword.value && !!password.value)

function getEmailFromQuery() {
  const value = route.query.email
  if (Array.isArray(value)) return value[0] ?? ''
  if (typeof value === 'string') return value
  return ''
}

const emailFromQuery = computed(getEmailFromQuery)
watch(
  emailFromQuery,
  (value) => {
    // Only prefill, don't override user input.
    if (!email.value && value) email.value = value
  },
  { immediate: true }
)

async function goNextStep() {
  otpError.value = null
  resendSuccess.value = false

  if (step.value === '0') {
    const result = await emailForm.value?.validate()
    if (!result?.valid) return
    step.value = '1'
    return
  }

  if (step.value === '1') {
    if (otp.value.length !== 6) {
      otpError.value = t(translationKeys.otp.errorInvalid)
      return
    }
    step.value = '2'
    return
  }

  const result = await passwordForm.value?.validate()
  if (!result?.valid) return
  if (!passwordsMatch.value) return

  // Background logic is intentionally omitted for this ticket.
  await router.push({ name: 'login' })
}

function cancel() {
  router.push({ name: 'login' })
}

async function resendOtp() {
  if (!email.value) return

  // No backend call here; this is only UI feedback for the current ticket.
  resendLoading.value = true
  resendSuccess.value = false

  setTimeout(() => {
    resendLoading.value = false
    resendSuccess.value = true
  }, 800)
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="w-100" justify="center">
      <v-col cols="12" sm="10" lg="8">
        <v-card
          :title="t(translationKeys.resetPassword.title)"
          :subtitle="t(translationKeys.resetPassword.description)"
          class="border px-4 py-4"
        >
          <template #prepend>
            <v-img
              :src="ResetPasswordImage"
              width="64"
              height="64"
              rounded="shaped"
              :alt="t(translationKeys.resetPassword.title)"
            />
          </template>

          <v-card-text>
            <v-stepper
              v-model="step"
              class="pa-0"
              alt-labels
              elevation="0"
              hide-actions
              style="border: none"
            >
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
                  <template #title>
                    {{ t(translationKeys.resetPassword.steps.newPassword) }}
                  </template>
                </v-stepper-item>
              </v-stepper-header>

              <v-stepper-window>
                <v-stepper-window-item value="0">
                  <v-form ref="emailForm" @submit.prevent>
                    <v-text-field
                      v-model="email"
                      density="default"
                      :rules="translatedEmailRules"
                      :label="t(translationKeys.form.mail.title)"
                      :placeholder="t(translationKeys.form.mail.placeholder)"
                      clearable
                      autocomplete="email"
                      required
                      :aria-label="t(translationKeys.form.mail.title)"
                    />
                  </v-form>

                  <div class="d-flex flex-column w-100">
                    <v-btn
                      type="button"
                      block
                      variant="flat"
                      color="success"
                      :disabled="!email"
                      :aria-label="t(translationKeys.resetPassword.next.email)"
                      @click="goNextStep"
                    >
                      {{ t(translationKeys.resetPassword.next.email) }}
                    </v-btn>

                    <v-btn
                      type="button"
                      block
                      variant="text"
                      class="mt-2"
                      :aria-label="t(translationKeys.resetPassword.cancel)"
                      @click="cancel"
                    >
                      {{ t(translationKeys.resetPassword.cancel) }}
                    </v-btn>
                  </div>
                </v-stepper-window-item>

                <v-stepper-window-item value="1">
                  <div class="d-flex flex-column ga-3">
                    <p class="mb-0">{{ t(translationKeys.otp.description) }}</p>

                    <v-otp-input
                      v-model="otp"
                      length="6"
                      type="number"
                      :aria-label="t(translationKeys.otp.codeAria)"
                      @finish="otpError = null"
                    />

                    <v-alert v-if="otpError" :text="otpError" type="error" class="mt-2"></v-alert>
                  </div>

                  <div class="mt-4">
                    <v-btn
                      block
                      color="primary"
                      variant="text"
                      :loading="resendLoading"
                      :disabled="!email"
                      :aria-label="t(translationKeys.resetPassword.resendOtpButton)"
                      @click="resendOtp"
                    >
                      {{ t(translationKeys.resetPassword.resendOtpButton) }}
                    </v-btn>

                    <v-alert
                      v-if="resendSuccess"
                      :text="t(translationKeys.success.resendMail)"
                      type="success"
                      class="mt-2"
                    ></v-alert>
                  </div>

                  <div class="d-flex flex-column w-100">
                    <v-btn
                      type="button"
                      block
                      variant="flat"
                      color="success"
                      :disabled="otp.length !== 6"
                      :aria-label="t(translationKeys.resetPassword.next.otp)"
                      @click="goNextStep"
                    >
                      {{ t(translationKeys.resetPassword.next.otp) }}
                    </v-btn>

                    <v-btn
                      type="button"
                      block
                      variant="text"
                      class="mt-2"
                      :aria-label="t(translationKeys.resetPassword.cancel)"
                      @click="cancel"
                    >
                      {{ t(translationKeys.resetPassword.cancel) }}
                    </v-btn>
                  </div>
                </v-stepper-window-item>

                <v-stepper-window-item value="2">
                  <v-form ref="passwordForm" @submit.prevent>
                    <v-text-field
                      v-model="password"
                      density="default"
                      :rules="translatedPasswordRules"
                      :label="t(translationKeys.form.password.title)"
                      :type="showPassword ? 'text' : 'password'"
                      required
                      autocomplete="new-password"
                      :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
                      @click:append-inner="showPassword = !showPassword"
                      :aria-label="t(translationKeys.form.password.title)"
                    />

                    <v-text-field
                      v-model="repeatPassword"
                      density="default"
                      :rules="translatedRepeatPasswordRules"
                      :label="t(translationKeys.resetPassword.password.repeatTitle)"
                      :type="showRepeatPassword ? 'text' : 'password'"
                      required
                      autocomplete="new-password"
                      :append-inner-icon="showRepeatPassword ? mdiEyeOff : mdiEye"
                      @click:append-inner="showRepeatPassword = !showRepeatPassword"
                      :aria-label="t(translationKeys.resetPassword.password.repeatTitle)"
                    />
                  </v-form>

                  <div class="d-flex flex-column w-100">
                    <v-btn
                      type="button"
                      block
                      variant="flat"
                      color="success"
                      :disabled="!passwordsMatch"
                      :aria-label="t(translationKeys.resetPassword.next.finish)"
                      @click="goNextStep"
                    >
                      {{ t(translationKeys.resetPassword.next.finish) }}
                    </v-btn>

                    <v-btn
                      type="button"
                      block
                      variant="text"
                      class="mt-2"
                      :aria-label="t(translationKeys.resetPassword.cancel)"
                      @click="cancel"
                    >
                      {{ t(translationKeys.resetPassword.cancel) }}
                    </v-btn>
                  </div>
                </v-stepper-window-item>
              </v-stepper-window>
            </v-stepper>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.v-stepper-header {
  box-shadow: none;
}
</style>

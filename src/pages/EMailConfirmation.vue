<script setup>
import { translationKeys, useOtp } from '@features/authentication'
import { useTranslation } from '@shared/lib'

const { execute, errorCode, resend, resendErrorCode, resendLoading, resendSuccess } = useOtp()
const { t } = useTranslation()
const router = useRouter()
const route = useRoute()
const email = computed(() => {
  const value = route.query.email
  if (Array.isArray(value)) return value[0] ?? ''
  return typeof value === 'string' ? value : ''
})
const otp = ref('')

const verifyOtp = async () => {
  const success = await execute(email.value, otp.value)
  if (!success) return

  router.push({ name: 'settings' })
}

const resendConfirmation = async () => {
  if (!email.value) return
  await resend(email.value)
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="420" class="pa-4">
      <v-card-title>{{ t(translationKeys.otp.title) }}</v-card-title>

      <v-card-text>
        <p>{{ t(translationKeys.otp.description) }}</p>

        <v-otp-input v-model="otp" length="6" type="number" @finish="verifyOtp" />
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
          @click="resendConfirmation"
        >
          Schicke mir eine neue Bestätigung zu
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { translationKeys, useOtp } from '@features/authentication'
import { useTranslation } from '@shared/lib'

const { execute, errorCode } = useOtp()
const { t } = useTranslation()
const router = useRouter()
const route = useRoute()
const email = route.query.email
const otp = ref('')

const verifyOtp = async () => {
  const success = await execute(email, otp.value)
  if (!success) return

  router.push({ name: 'settings' })
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
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { checkOtp } from '@shared/api'
import { useTranslation } from '@shared/lib/i18n/use-translation'
import { translationKeys } from '@features/authentication/i18n/keys'

const { t } = useTranslation()
const router = useRouter()
const route = useRoute()
const email = route.query.email
const otp = ref('')

const verifyOtp = async () => {
  try {
    if (!email) {
      throw new Error('Email is required')
    }

    await checkOtp(email, otp.value)
  } catch (error) {
    console.log('mail', email, otp.value)
    console.error(error.message)
    return
  }

  router.push({ name: 'settings' })
}
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
          @finish="verifyOtp"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

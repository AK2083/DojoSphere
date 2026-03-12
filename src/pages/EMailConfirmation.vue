<script setup>
import { useRoute, useRouter } from 'vue-router'
import { checkOtp } from '@shared/api'
import { ref } from 'vue'

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

  router.push('/settings')
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="420" class="pa-4">
      <v-card-title>Email bestätigen</v-card-title>

      <v-card-text>
        <p>Bitte gib den Code aus deiner Email ein.</p>

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

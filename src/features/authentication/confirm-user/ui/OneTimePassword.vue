<script setup lang="ts">
import { translationKeysPasswordForgotten, useSendOneTimePassword } from '@features/authentication'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
const sendOtp = useSendOneTimePassword()
</script>

<template>
  <v-otp-input
    v-model="sendOtp.token.value"
    length="6"
    type="number"
    :aria-label="t(translationKeysPasswordForgotten.steps.otp.ariaLabel)"
    @finish="sendOtp.execute()"
  />
  <v-alert
    v-if="sendOtp.errorCode !== null"
    :text="sendOtp.errorCode.value ?? ''"
    type="error"
    class="mt-2"
  ></v-alert>
</template>

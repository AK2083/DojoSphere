<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@shared/lib'
import OtpInput from '@shared/ui/OtpInput.vue'

import translationKeys from '../i18n/keys'
import { useSendOneTimePassword } from '../model/use-send-one-time-password'
import ResendOneTimePassword from './ResendOneTimePassword.vue'

const { t } = useTranslation()
const sendOtp = useSendOneTimePassword()
const isOtpValid = computed(() => sendOtp.token.value.length === 6)
</script>

<template>
  <v-card
    width="650"
    class="pa-4"
    :title="t(translationKeys.title, { email: sendOtp.email.value })"
    :subtitle="t(translationKeys.description)"
    variant="tonal"
  >
    <v-card-text>
      <OtpInput
        :model-value="sendOtp.token.value"
        :aria-label="t(translationKeys.ariaLabel)"
        @update:model-value="sendOtp.token.value = $event"
      ></OtpInput>
      <v-alert
        v-if="sendOtp.errorCode.value"
        :text="t(sendOtp.errorCode.value)"
        type="error"
        class="mt-2"
      ></v-alert>
      <ResendOneTimePassword />
    </v-card-text>
    <v-card-actions>
      <v-btn
        type="submit"
        block
        variant="flat"
        color="success"
        :loading="sendOtp.loading.value"
        :disabled="!isOtpValid || sendOtp.loading.value"
        @click="sendOtp.send()"
      >
        {{ t(translationKeys.submit) }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

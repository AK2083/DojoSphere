<script setup lang="ts">
import { translationKeysPasswordForgotten } from '@features/authentication'
import { useTranslation } from '@shared/lib'

import OneTimePassword from './OneTimePassword.vue'
import ResendOneTimePassword from './ResendOneTimePassword.vue'

const { t } = useTranslation()
</script>

<template>
  <v-card
    width="420"
    class="pa-4"
    :title="t(translationKeysPasswordForgotten.steps.otp.title)"
    :subtitle="t(translationKeysPasswordForgotten.steps.otp.description)"
    variant="tonal"
  >
    <v-card-text>
      <OneTimePassword />
    </v-card-text>
    <v-card-actions>
      <ResendOneTimePassword />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import {
  PasswordStepper,
  ResetPasswordImage,
  translationKeysPasswordForgotten
} from '@features/authentication'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="w-100" justify="center">
      <v-col cols="12" sm="10" lg="8">
        <v-card
          :title="t(translationKeysPasswordForgotten.title)"
          :subtitle="t(translationKeysPasswordForgotten.description)"
          class="border px-4 py-4"
        >
          <template #prepend>
            <v-img
              :src="ResetPasswordImage"
              width="64"
              height="64"
              rounded="shaped"
              :alt="t(translationKeysPasswordForgotten.title)"
            />
          </template>

          <PasswordStepper />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
:deep(.v-stepper-header) {
  box-shadow: none;
}
</style>

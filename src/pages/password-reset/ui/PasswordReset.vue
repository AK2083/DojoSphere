<script setup lang="ts">
import { PasswordStepper, translationKeys } from '@features/authentication/password-forgotten'
import { mdiLockReset } from '@mdi/js'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="w-100" justify="center">
      <v-col cols="12" lg="10">
        <v-card
          :title="t(translationKeys.steps.title)"
          :subtitle="t(translationKeys.steps.description)"
          class="border px-4 py-4"
        >
          <template #prepend>
            <v-avatar color="primary" size="48">
              <v-icon :icon="mdiLockReset" size="32"></v-icon>
            </v-avatar>
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

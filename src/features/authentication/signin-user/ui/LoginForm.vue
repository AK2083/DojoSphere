<script setup lang="ts">
import { mdiEye, mdiEyeOff, mdiLogin } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useLoginForm } from '../model/use-form'

const { t } = useTranslation()
const {
  isFormValid,
  email,
  password,
  showPassword,
  translatedEmailRules,
  translatedPasswordRules,
  errorCode,
  loading,
  setFormRef,
  submit,
  navigateToPasswordReset
} = useLoginForm()
</script>

<template>
  <v-form v-model="isFormValid" :ref="setFormRef" @submit.prevent="submit">
    <v-card
      :title="t(translationKeys.title)"
      :subtitle="t(translationKeys.description)"
      class="border px-4 py-4"
    >
      <template #prepend>
        <v-avatar color="primary" size="48">
          <v-icon :icon="mdiLogin" size="32"></v-icon>
        </v-avatar>
      </template>

      <v-card-text class="d-flex flex-column ga-3">
        <v-text-field
          v-model="email"
          density="default"
          :rules="translatedEmailRules"
          :label="t(translationKeys.mail.title)"
          :placeholder="t(translationKeys.mail.placeholder)"
          clearable
          autocomplete="email"
          required
          :aria-label="t(translationKeys.mail.title)"
        />

        <v-text-field
          v-model="password"
          density="default"
          :rules="translatedPasswordRules"
          :label="t(translationKeys.password.title)"
          :type="showPassword ? 'text' : 'password'"
          required
          autocomplete="current-password"
          :aria-label="t(translationKeys.password.title)"
        >
          <template #append-inner>
            <v-tooltip :text="t(translationKeys.password.displayToggle)" location="bottom">
              <template #activator="{ props }">
                <v-btn
                  type="button"
                  variant="text"
                  size="small"
                  v-bind="props"
                  :aria-label="t(translationKeys.password.displayToggle)"
                  :icon="showPassword ? mdiEyeOff : mdiEye"
                  @click="showPassword = !showPassword"
                />
              </template>
            </v-tooltip>
          </template>
        </v-text-field>
      </v-card-text>

      <template #actions>
        <div class="d-flex flex-column w-100">
          <v-btn
            type="submit"
            block
            variant="flat"
            color="success"
            :loading="loading"
            :disabled="!isFormValid"
            :aria-label="t(translationKeys.submit)"
          >
            {{ t(translationKeys.submit) }}
          </v-btn>

          <v-alert v-if="errorCode" :text="t(errorCode)" type="error" class="mt-2"></v-alert>

          <v-btn
            type="button"
            block
            variant="text"
            class="mt-2"
            :aria-label="t(translationKeys.forgotPassword)"
            @click="navigateToPasswordReset"
          >
            {{ t(translationKeys.forgotPassword) }}
          </v-btn>

          <div class="d-flex align-center justify-center w-100 mt-2">
            <span class="text-body-2 text-medium-emphasis">
              {{ t(translationKeys.noAccount) }}
            </span>
            <v-btn
              variant="plain"
              :to="{ name: 'datasource' }"
              :aria-label="t(translationKeys.register)"
              class="text-none"
            >
              {{ t(translationKeys.register) }}
            </v-btn>
          </div>
        </div>
      </template>
    </v-card>
  </v-form>
</template>

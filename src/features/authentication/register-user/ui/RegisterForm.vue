<script setup lang="ts">
import { mdiAccountCircle, mdiEye, mdiEyeOff } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useRegisterForm } from '../model/use-form'

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
  submit
} = useRegisterForm()
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
          <v-icon :icon="mdiAccountCircle" size="32"></v-icon>
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
        ></v-text-field>
        <v-text-field
          v-model="password"
          density="default"
          :rules="translatedPasswordRules"
          :label="t(translationKeys.password.title)"
          :type="showPassword ? 'text' : 'password'"
          required
          autocomplete="new-password"
        >
          <template #append-inner>
            <v-btn
              type="button"
              variant="text"
              size="small"
              :title="t(translationKeys.password.displayToggle)"
              :aria-label="t(translationKeys.password.displayToggle)"
              :icon="showPassword ? mdiEyeOff : mdiEye"
              @click="showPassword = !showPassword"
            />
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
          >
            {{ t(translationKeys.submit) }}
          </v-btn>
          <v-alert v-if="errorCode" :text="t(errorCode)" type="error" class="mt-2"></v-alert>

          <div class="d-flex align-center justify-center w-100 mt-2">
            <span class="text-body-2 text-medium-emphasis">
              {{ t(translationKeys.alreadyAccount) }}
            </span>
            <v-btn
              type="button"
              variant="plain"
              :to="{ name: 'login' }"
              :aria-label="t(translationKeys.logMeIn)"
              class="text-none"
            >
              {{ t(translationKeys.logMeIn) }}
            </v-btn>
          </div>
        </div>
      </template>
    </v-card>
  </v-form>
</template>

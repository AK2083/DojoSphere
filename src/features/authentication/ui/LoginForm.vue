<script setup lang="ts">
import type { VForm } from 'vuetify/components'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import { emailRules, mapRule, passwordRules, useTranslation } from '@shared/lib'

import LoginPlaceholderImage from '../assets/Register.webp'
import { translationKeys } from '../i18n/keys'

const { t } = useTranslation()

const form = ref<VForm | null>(null)
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const translatedEmailRules = emailRules.map((rule) => mapRule(rule, t))
const translatedPasswordRules = passwordRules.map((rule) => mapRule(rule, t))

async function submit() {
  if (!form.value) return

  const result = await form.value.validate()
  if (!result.valid) return
}
</script>

<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-card
      :title="t(translationKeys.login.title)"
      :subtitle="t(translationKeys.login.description)"
      class="border px-4 py-4"
    >
      <template #prepend>
        <!-- Placeholder image (will be replaced with the real login image later) -->
        <v-img
          :src="LoginPlaceholderImage"
          width="64"
          height="64"
          rounded="shaped"
          :alt="t(translationKeys.login.title)"
        />
      </template>

      <v-card-text class="d-flex flex-column ga-3">
        <v-text-field
          v-model="email"
          density="default"
          :rules="translatedEmailRules"
          :label="t(translationKeys.form.mail.title)"
          :placeholder="t(translationKeys.form.mail.placeholder)"
          clearable
          autocomplete="email"
          required
          :aria-label="t(translationKeys.form.mail.title)"
        />

        <v-text-field
          v-model="password"
          density="default"
          :rules="translatedPasswordRules"
          :label="t(translationKeys.form.password.title)"
          :type="showPassword ? 'text' : 'password'"
          required
          autocomplete="current-password"
          :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
          @click:append-inner="showPassword = !showPassword"
          :aria-label="t(translationKeys.form.password.title)"
        />
      </v-card-text>

      <template #actions>
        <div class="d-flex flex-column w-100">
          <v-btn
            type="submit"
            block
            variant="flat"
            color="success"
            :aria-label="t(translationKeys.login.submit)"
          >
            {{ t(translationKeys.login.submit) }}
          </v-btn>

          <v-btn
            type="button"
            block
            variant="text"
            class="mt-2"
            :aria-label="t(translationKeys.login.forgotPassword)"
          >
            {{ t(translationKeys.login.forgotPassword) }}
          </v-btn>
        </div>
      </template>
    </v-card>
  </v-form>
</template>

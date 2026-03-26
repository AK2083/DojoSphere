<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { VForm } from 'vuetify/components'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import { emailRules, mapRule, passwordRules, useTranslation } from '@shared/lib'

import LoginPlaceholderImage from '../assets/Register.webp'
import translationKeys from '../i18n/keys'
import { useLogin } from '../model/use-login'

const { t } = useTranslation()
const route = useRoute()
const router = useRouter()
const { execute, errorCode, loading } = useLogin()

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

  const success = await execute(email.value, password.value)
  if (!success) return

  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')) {
    await router.push(redirect)
    return
  }

  await router.push({ name: 'welcome' })
}

function goToPasswordReset() {
  if (!email.value) {
    router.push({ name: 'passwordReset' })
    return
  }

  router.push({ name: 'passwordReset', query: { email: email.value } })
}
</script>

<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-card
      :title="t(translationKeys.title)"
      :subtitle="t(translationKeys.description)"
      class="border px-4 py-4"
    >
      <template #prepend>
        <!-- Placeholder image (will be replaced with the real login image later) -->
        <v-img
          :src="LoginPlaceholderImage"
          width="64"
          height="64"
          rounded="shaped"
          :alt="t(translationKeys.title)"
        />
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
          :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
          @click:append-inner="showPassword = !showPassword"
          :aria-label="t(translationKeys.password.title)"
        />
      </v-card-text>

      <template #actions>
        <div class="d-flex flex-column w-100">
          <v-btn
            type="submit"
            block
            variant="flat"
            color="success"
            :loading="loading"
            :disabled="loading"
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
            @click="goToPasswordReset"
          >
            {{ t(translationKeys.forgotPassword) }}
          </v-btn>

          <div class="d-flex align-center justify-center w-100 mt-2">
            <span class="text-body-2 text-medium-emphasis">
              {{ t(translationKeys.noAccount) }}
            </span>
            <v-btn
              variant="plain"
              :to="{ name: 'home' }"
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

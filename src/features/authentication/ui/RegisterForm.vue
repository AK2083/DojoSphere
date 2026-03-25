<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { VForm } from 'vuetify/components'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import { emailRules, mapRule, passwordRules, useTranslation } from '@shared/lib'

import RegisterImage from '../assets/Register.webp'
import { translationKeys } from '../i18n/keys'
import { useRegister } from '../model/register/use-register'

const { t } = useTranslation()
const router = useRouter()
const { execute, errorCode, loading } = useRegister()

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

  router.push({
    name: 'emailConfirmation',
    query: { email: email.value }
  })
}
</script>

<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-card
      :title="t(translationKeys.form.title)"
      :subtitle="t(translationKeys.form.description)"
      class="border px-4 py-4"
    >
      <template #prepend>
        <v-img :src="RegisterImage" width="64" height="64" rounded="shaped" />
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
        ></v-text-field>
        <v-text-field
          v-model="password"
          density="default"
          :rules="translatedPasswordRules"
          :label="t(translationKeys.form.password.title)"
          :type="showPassword ? 'text' : 'password'"
          required
          autocomplete="new-password"
          :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>
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
          >
            {{ t(translationKeys.form.submit) }}
          </v-btn>
          <v-alert v-if="errorCode" :text="t(errorCode)" type="error" class="mt-2"></v-alert>

          <div class="d-flex align-center justify-center w-100 mt-2">
            <span class="text-body-2 text-medium-emphasis">
              {{ t(translationKeys.form.alreadyAccount) }}
            </span>
            <v-btn
              variant="plain"
              :to="{ name: 'login' }"
              :aria-label="t(translationKeys.form.logMeIn)"
              class="text-none"
            >
              {{ t(translationKeys.form.logMeIn) }}
            </v-btn>
          </div>
        </div>
      </template>
    </v-card>
  </v-form>
</template>

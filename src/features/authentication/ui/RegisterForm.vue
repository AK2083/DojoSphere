<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { VForm } from 'vuetify/components'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import { useTranslation } from '@shared/lib/i18n/use-translation'

import RegisterImage from '../assets/Register.webp'
import { translationKeys } from '../i18n/keys'
import { emailRules, mapRule, passwordRules } from '../lib/validation/validators'
import { useRegister } from '../model/use-register'

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
        </div>
      </template>
    </v-card>
  </v-form>
</template>

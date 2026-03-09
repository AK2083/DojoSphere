<script setup>
import RegisterImage from '../assets/Register.webp'
import { emailRules, passwordRules } from '../lib/validation/validators'
import { translationKeys } from '../i18n/keys'
import { mapRule } from '../lib/map-rule'
import { emailErrorMap, passwordErrorMap } from '../lib/validation/error-maps'
import { useTranslation } from '@shared/lib/i18n/use-translation'

const { t } = useTranslation()

const translatedEmailRules = emailRules.map((rule) =>
  mapRule(rule, emailErrorMap, t)
)

const translatedPasswordRules = passwordRules.map((rule) =>
  mapRule(rule, passwordErrorMap, t)
)

const form = ref(null)
const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function submit() {
  const result = await form.value.validate()

  if (!result.valid) return

  form.value.reset()
  form.value.resetValidation()
  showPassword.value = false
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
          density="compact"
          :rules="translatedEmailRules"
          :label="t(translationKeys.form.mail.title)"
          :placeholder="t(translationKeys.form.mail.placeholder)"
          clearable
          autocomplete="email"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          density="compact"
          :rules="translatedPasswordRules"
          :label="t(translationKeys.form.password.title)"
          :type="showPassword ? 'text' : 'password'"
          required
          autocomplete="new-password"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>
      </v-card-text>

      <template #actions>
        <v-btn type="submit" block variant="flat" color="success">{{
          t(translationKeys.form.submit)
        }}</v-btn>
      </template>
    </v-card>
  </v-form>
</template>

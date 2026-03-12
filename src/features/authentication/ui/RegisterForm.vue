<script setup lang="ts">
import RegisterImage from '../assets/Register.webp'
import { emailRules, passwordRules } from '../lib/validation/validators'
import { translationKeys } from '../i18n/keys'
import { mapRule } from '../lib/map-rule'
import { emailErrorMap, passwordErrorMap } from '../lib/validation/error-maps'
import { useTranslation } from '@shared/lib/i18n/use-translation'
import { mdiEyeOff, mdiEye } from '@mdi/js'
import { AppError } from '@shared/errors/app-error'
import type { VForm } from 'vuetify/components'
import { useRouter } from 'vue-router'
import { registerUser } from '@shared/api'

const form = ref<VForm | null>(null)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorCode = ref<string | null>(null)
const { t } = useTranslation()
const router = useRouter()

const translatedEmailRules = emailRules.map((rule) =>
  mapRule(rule, emailErrorMap, t)
)

const translatedPasswordRules = passwordRules.map((rule) =>
  mapRule(rule, passwordErrorMap, t)
)

async function submit() {
  if (!form.value) return

  const result = await form.value.validate()

  if (!result.valid) return

  try {
    await registerUser(email.value, password.value)
    errorCode.value = null
    router.push({
      name: 'emailConfirmation',
      query: { email: email.value }
    })
  } catch (e: unknown) {
    console.error(e)

    if (e instanceof AppError) {
      errorCode.value = e.code
    } else {
      errorCode.value = 'unknown_error'
    }
  } finally {
    form.value.reset()
    form.value.resetValidation()
    showPassword.value = false
  }
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
          :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>
      </v-card-text>

      <template #actions>
        <div class="d-flex flex-column w-100">
          <v-btn type="submit" block variant="flat" color="success">{{
            t(translationKeys.form.submit)
          }}</v-btn>
          <v-alert
            v-if="errorCode"
            :text="t(`errors.${errorCode}`)"
            type="error"
            class="mt-2"
          ></v-alert>
        </div>
      </template>
    </v-card>
  </v-form>
</template>

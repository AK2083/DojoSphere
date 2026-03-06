<script setup>
import registerImage from '@features/authentication/assets/Register.webp'
import {
  emailRules,
  passwordRules
} from '@features/authentication/validation/validators'

const form = ref(null)
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const submit = async () => {
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
      title="Registrierung"
      subtitle="Hier kann sich registriert werden."
      class="border px-4 py-4"
    >
      <template #prepend>
        <v-img :src="registerImage" width="64" height="64" rounded="shaped" />
      </template>

      <v-card-text class="d-flex flex-column ga-3">
        <v-text-field
          v-model="email"
          density="compact"
          :rules="emailRules"
          label="E-Mail"
          clearable
          autocomplete="email"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          density="compact"
          :rules="passwordRules"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          required
          autocomplete="new-password"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>
      </v-card-text>

      <template #actions>
        <v-btn type="submit" block variant="flat" color="success"
          >Registriere mich</v-btn
        >
      </template>
    </v-card>
  </v-form>
</template>

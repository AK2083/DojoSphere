<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { mdiEye, mdiEyeOff, mdiLockReset } from '@mdi/js'
import { mapRule, passwordRules, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useNewPasswordStep } from '../model/use-new-password-step'

const { t } = useTranslation()
const newPasswordStep = useNewPasswordStep()

const emit = defineEmits<{
  (event: 'update:valid', value: boolean): void
}>()

defineExpose({
  submit
})

const form = ref<VForm | null>(null)
const showPassword = ref(false)
const showRepeatedPassword = ref(false)
const isFormValid = ref(false)
const repeatedPassword = ref('')

const translatedPasswordRules = passwordRules.map((rule) => mapRule(rule, t))
const passwordsMatch = computed<boolean>(
  () =>
    newPasswordStep.password.value === repeatedPassword.value && !!newPasswordStep.password.value
)
const repeatPasswordRules = computed(() => [
  ...translatedPasswordRules,
  (value: string) =>
    value === newPasswordStep.password.value || t(translationKeys.steps.newPassword.error.mismatch)
])

async function submit(): Promise<boolean> {
  if (!form.value) {
    return false
  }

  const result = await form.value.validate()

  if (!result.valid || !passwordsMatch.value) {
    return false
  }

  return newPasswordStep.submit()
}

watch(
  [isFormValid, passwordsMatch],
  ([formValid, match]) => {
    emit('update:valid', formValid && match)
  },
  { immediate: true }
)
</script>

<template>
  <v-alert
    v-if="newPasswordStep.error.value"
    :text="newPasswordStep.error.value ?? ''"
    :type="'error'"
    class="mt-2"
  />
  <v-form ref="form" v-model="isFormValid" validate-on="input">
    <v-card class="pa-4" variant="tonal">
      <template #title>
        <div class="v-card-title" id="newPasswordTitle">
          {{ t(translationKeys.steps.newPassword.title) }}
        </div>
      </template>

      <template #subtitle>
        <div class="v-card-subtitle" id="newPasswordDescription">
          {{ t(translationKeys.steps.newPassword.description) }}
        </div>
      </template>

      <template #prepend>
        <v-avatar color="blue-darken-2">
          <v-icon :icon="mdiLockReset" size="30"></v-icon>
        </v-avatar>
      </template>

      <v-card-text>
        <v-text-field
          :model-value="newPasswordStep.password.value"
          density="default"
          :rules="repeatPasswordRules"
          :label="t(translationKeys.steps.newPassword.passwordLabel)"
          :type="showPassword ? 'text' : 'password'"
          required
          autofocus
          autocomplete="new-password"
          :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
          :loading="newPasswordStep.loading.value"
          @click:append-inner="showPassword = !showPassword"
          @update:model-value="newPasswordStep.password.value = $event"
          :aria-label="t(translationKeys.steps.newPassword.ariaPasswordLabel)"
        />

        <v-text-field
          :model-value="repeatedPassword"
          density="default"
          :rules="repeatPasswordRules"
          :label="t(translationKeys.steps.newPassword.newPasswordLabel)"
          :type="showRepeatedPassword ? 'text' : 'password'"
          required
          autocomplete="new-password"
          :loading="newPasswordStep.loading.value"
          :append-inner-icon="showRepeatedPassword ? mdiEyeOff : mdiEye"
          @click:append-inner="showRepeatedPassword = !showRepeatedPassword"
          @update:model-value="repeatedPassword = $event"
          :aria-label="t(translationKeys.steps.newPassword.ariaNewPasswordLabel)"
        />
      </v-card-text>
    </v-card>
  </v-form>
</template>

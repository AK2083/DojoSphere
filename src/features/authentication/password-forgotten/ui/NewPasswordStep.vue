<script setup lang="ts">
import { mdiEye, mdiEyeOff, mdiLockReset } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useNewPasswordStepForm } from '../model/new-password-step/use-form'

const { t } = useTranslation()
const validModel = defineModel<boolean>('valid', { default: false })
const loadingModel = defineModel<boolean>('loading', { default: false })

const newPasswordStep = useNewPasswordStepForm({
  validModel,
  loadingModel
})

defineExpose({
  submit
})

async function submit(): Promise<boolean> {
  return newPasswordStep.submit()
}
</script>

<template>
  <v-alert
    v-if="newPasswordStep.error.value"
    :text="t(newPasswordStep.error.value ?? '')"
    :type="'error'"
    class="mt-2"
  />
  <v-form
    :ref="newPasswordStep.setFormRef"
    v-model="newPasswordStep.isFormValid.value"
    validate-on="input"
  >
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
          :rules="newPasswordStep.repeatPasswordRules.value"
          :label="t(translationKeys.steps.newPassword.passwordLabel)"
          :type="newPasswordStep.showPassword.value ? 'text' : 'password'"
          required
          autofocus
          autocomplete="new-password"
          :append-inner-icon="newPasswordStep.showPassword.value ? mdiEyeOff : mdiEye"
          :loading="newPasswordStep.loading.value"
          @click:append-inner="
            newPasswordStep.showPassword.value = !newPasswordStep.showPassword.value
          "
          @update:model-value="newPasswordStep.password.value = $event"
          :aria-label="t(translationKeys.steps.newPassword.ariaPasswordLabel)"
        />

        <v-text-field
          :model-value="newPasswordStep.repeatedPassword.value"
          density="default"
          :rules="newPasswordStep.repeatPasswordRules.value"
          :label="t(translationKeys.steps.newPassword.newPasswordLabel)"
          :type="newPasswordStep.showRepeatedPassword.value ? 'text' : 'password'"
          required
          autocomplete="new-password"
          :loading="newPasswordStep.loading.value"
          :append-inner-icon="newPasswordStep.showRepeatedPassword.value ? mdiEyeOff : mdiEye"
          @click:append-inner="
            newPasswordStep.showRepeatedPassword.value = !newPasswordStep.showRepeatedPassword.value
          "
          @update:model-value="newPasswordStep.repeatedPassword.value = $event"
          :aria-label="t(translationKeys.steps.newPassword.ariaNewPasswordLabel)"
        />
      </v-card-text>
    </v-card>
  </v-form>
</template>

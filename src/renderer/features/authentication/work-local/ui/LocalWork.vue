<script setup lang="ts">
import { mdiHarddisk } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useLocalWorkForm } from '../model/use-form'

const { t } = useTranslation()
const {
  isFormValid,
  displayName,
  translatedDisplayNameRules,
  isSubmitDisabled,
  loading,
  setFormRef,
  submit
} = useLocalWorkForm()
</script>

<template>
  <v-form v-model="isFormValid" :ref="setFormRef" @submit.prevent="submit">
    <v-card
      :title="t(translationKeys.title)"
      :subtitle="t(translationKeys.subtitle)"
      class="border px-4 py-4"
    >
      <template #prepend>
        <v-avatar color="primary" size="48">
          <v-icon :icon="mdiHarddisk" size="32"></v-icon>
        </v-avatar>
      </template>

      <template #text>
        <div class="d-flex flex-column ga-3">
          <span>{{ t(translationKeys.description) }}</span>

          <v-text-field
            v-model="displayName"
            id="local-work-display-name"
            density="default"
            :rules="translatedDisplayNameRules"
            :label="t(translationKeys.displayName.label)"
            autocomplete="username"
            required
            :aria-label="t(translationKeys.displayName.label)"
            :aria-required="true"
          />
        </div>
      </template>

      <template #actions>
        <v-btn
          type="submit"
          :text="t(translationKeys.submit)"
          variant="tonal"
          block
          :loading="loading"
          :disabled="isSubmitDisabled"
          :aria-label="t(translationKeys.submit)"
        />
      </template>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { mdiAccountCog } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useUsernameForm } from '../model/use-username-form'

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const { username, loading, errorCode, success, canSave, save } = useUsernameForm()

const isMobile = computed(() => smAndDown.value)
</script>

<template>
  <v-col v-if="!isMobile" cols="2" class="d-flex justify-center">
    <v-icon :icon="mdiAccountCog" size="64" aria-hidden="true"></v-icon>
  </v-col>

  <v-col cols="12" md="10" class="d-flex flex-column">
    <div>
      <label class="font-weight-medium">{{ t(translationKeys.title) }}</label>
      <div class="text-medium-emphasis text-body-2">
        {{ t(translationKeys.description) }}
      </div>
    </div>

    <v-text-field
      v-model="username"
      class="mt-2"
      :label="t(translationKeys.title)"
      :aria-label="t(translationKeys.title)"
      density="comfortable"
      hide-details="auto"
      :error-messages="errorCode ? t(errorCode) : undefined"
      @keyup.enter="save"
    />

    <div class="d-flex align-center justify-end mt-2 ga-3">
      <span v-if="success" class="text-body-2 text-success" role="status" aria-live="polite">
        {{ t(translationKeys.success) }}
      </span>

      <v-btn
        color="primary"
        :disabled="!canSave"
        :loading="loading"
        :aria-label="t(translationKeys.save)"
        @click="save"
      >
        {{ t(translationKeys.save) }}
      </v-btn>
    </div>
  </v-col>
</template>

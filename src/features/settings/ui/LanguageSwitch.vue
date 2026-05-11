<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { mdiTranslateVariant } from '@mdi/js'
import { AvailableLanguages, LanguageCode, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { setLanguageToStorage } from '../service/set-language/language-storage'

const { t, locale } = useTranslation()

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

const selectedLanguage = computed(() => locale.value as LanguageCode)

function handleLanguageChange(val: LanguageCode) {
  if (val === locale.value) return

  locale.value = val
  setLanguageToStorage(val)
}
</script>
<template>
  <v-col v-if="!isMobile" cols="2" class="d-flex justify-center">
    <v-icon :icon="mdiTranslateVariant" size="64"></v-icon>
  </v-col>

  <v-col cols="12" md="10" class="d-flex flex-column">
    <div>
      <label class="font-weight-medium">{{ t(translationKeys.language.title) }}</label>
      <div class="text-medium-emphasis text-body-2">
        {{ t(translationKeys.language.description) }}
      </div>
    </div>

    <v-select
      :model-value="selectedLanguage"
      class="mt-2"
      :label="t(translationKeys.language.title)"
      :items="AvailableLanguages"
      item-title="label"
      item-value="code"
      density="comfortable"
      hide-details
      @update:model-value="handleLanguageChange"
    />
  </v-col>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { AvailableLanguages, LanguageCode } from '@shared/lib/i18n/languages'
import { useTranslation } from '@shared/lib/i18n/use-translation'

import LanguageImage from '../assets/Language.webp'
import { translationKeys } from '../i18n/keys'
import { setLanguageToStorage } from '../model/language-storage'

const { t, locale } = useTranslation()

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

const selectedLanguage = computed<LanguageCode>({
  get: () => locale.value as LanguageCode,
  set: (val) => {
    locale.value = val
    setLanguageToStorage(val)
  }
})
</script>
<template>
  <v-col v-if="!isMobile" cols="2" class="d-flex justify-center">
    <v-img :src="LanguageImage" width="120" height="120" rounded="shaped" alt="Rei-Language" />
  </v-col>

  <v-col cols="12" md="10" class="d-flex flex-column">
    <div>
      <label class="font-weight-medium">{{ t(translationKeys.language.title) }}</label>
      <div class="text-medium-emphasis text-body-2">
        {{ t(translationKeys.language.description) }}
      </div>
    </div>

    <v-select
      v-model="selectedLanguage"
      class="mt-2"
      :label="t(translationKeys.language.title)"
      :items="AvailableLanguages"
      item-title="label"
      item-value="code"
      density="comfortable"
      hide-details
    />
  </v-col>
</template>

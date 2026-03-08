<script setup>
import { LanguageImage } from '@features/settings/assets'
import { useDisplay } from 'vuetify'
import { useTranslation, translationKeys } from '@features/settings/i18n'

const { t } = useTranslation()
const { smAndDown } = useDisplay()

const isMobile = computed(() => smAndDown.value)
</script>
<template>
  <v-col v-if="!isMobile" cols="2" class="d-flex justify-center">
    <v-img
      :src="LanguageImage"
      width="120"
      height="120"
      rounded="shaped"
      alt="Rei-Language"
    />
  </v-col>

  <v-col cols="12" md="10" class="d-flex flex-column">
    <div>
      <label class="font-weight-medium">{{
        t(translationKeys.language.title)
      }}</label>
      <div class="text-medium-emphasis text-body-2">
        {{ t(translationKeys.language.description) }}
      </div>
    </div>

    <v-select
      class="mt-2"
      :label="t(translationKeys.language.title)"
      :items="['Englisch', 'Deutsch']"
      density="comfortable"
      hide-details
    />
  </v-col>
</template>

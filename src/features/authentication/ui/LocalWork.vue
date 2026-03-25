<script setup lang="ts">
import { useTranslation } from '@shared/lib'

import LocalImage from '../assets/Local.webp'
import { translationKeys } from '../i18n/keys'

const { t } = useTranslation()
</script>

<template>
  <v-card
    :title="t(translationKeys.useLocal.title)"
    :subtitle="t(translationKeys.useLocal.subtitle)"
    class="border px-4 py-4"
  >
    <template #prepend>
      <v-img :src="LocalImage" width="64" height="64" rounded="shaped" cover class="border" />
    </template>

    <template #text>
      <span>{{ t(translationKeys.useLocal.description) }}</span>
    </template>

    <template #actions>
      <v-btn :text="t(translationKeys.useLocal.submit)" variant="tonal" block></v-btn>
    </template>
  </v-card>
</template>

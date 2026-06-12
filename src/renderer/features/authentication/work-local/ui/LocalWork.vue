<script setup lang="ts">
import { mdiHarddisk } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'

const { t } = useTranslation()
</script>

<template>
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
      <span>{{ t(translationKeys.description) }}</span>
    </template>

    <template #actions>
      <v-btn :text="t(translationKeys.submit)" variant="tonal" block></v-btn>
    </template>
  </v-card>
</template>

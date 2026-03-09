<script setup lang="ts">
import { translationKeys } from '@features/settings'
import { useTranslation } from '@shared/lib/i18n/use-translation'

const { t } = useTranslation()
</script>

<template>
  <v-container class="pa-6" max-width="900">
    <h2 class="text-h5 mb-6">{{ t(translationKeys.title) }}</h2>

    <v-sheet class="mb-4 border rounded pa-4">
      <v-row class="align-center">
        <LanguageSwitch />
      </v-row>
    </v-sheet>

    <v-sheet class="mb-4 border rounded pa-4">
      <v-row class="align-center">
        <ThemeToggle />
      </v-row>
    </v-sheet>
  </v-container>
</template>

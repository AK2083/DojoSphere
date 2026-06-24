<script setup lang="ts">
import { translationKeys } from '@features/audience'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-8" max-width="560" width="100%">
      <v-card-title class="text-h4 text-center">{{ t(translationKeys.title) }}</v-card-title>
      <v-card-text class="text-center text-medium-emphasis">
        {{ t(translationKeys.description) }}
      </v-card-text>
    </v-card>
  </v-container>
</template>

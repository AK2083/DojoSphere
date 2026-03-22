<script setup lang="ts">
import { translationKeys } from '@features/authentication'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-8" max-width="480" width="100%">
      <v-card-title class="text-h4 text-center">
        {{ t(translationKeys.welcome.title) }}
      </v-card-title>
    </v-card>
  </v-container>
</template>

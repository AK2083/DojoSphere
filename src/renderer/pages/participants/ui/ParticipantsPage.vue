<script setup lang="ts">
import { ParticipantList, translationKeys } from '@features/competitors'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
</script>

<template>
  <v-container class="pa-6" max-width="1200">
    <h1 class="text-h5 mb-6">{{ t(translationKeys.title) }}</h1>
    <ParticipantList />
  </v-container>
</template>

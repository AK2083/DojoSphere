<script setup lang="ts">
import { ClubOverview, translationKeys } from '@features/clubs'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
</script>

<template>
  <v-container class="pa-6" fluid>
    <h1 class="text-h5 mb-6">{{ t(translationKeys.title) }}</h1>
    <ClubOverview />
  </v-container>
</template>

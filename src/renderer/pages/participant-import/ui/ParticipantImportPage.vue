<script setup lang="ts">
import { importParticipantsTranslationKeys, ParticipantImportStepper } from '@features/competitors'
import { mdiArrowLeft } from '@mdi/js'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
</script>

<template>
  <v-container class="pa-6" fluid>
    <div class="participant-import-page">
      <div class="d-flex flex-column ga-1 mb-1">
        <v-btn
          :to="{ name: 'participants' }"
          variant="text"
          class="align-self-start participant-import-page__back"
          :prepend-icon="mdiArrowLeft"
          :aria-label="t(importParticipantsTranslationKeys.actions.back)"
        >
          {{ t(importParticipantsTranslationKeys.actions.back) }}
        </v-btn>
        <h1 class="text-h5 mb-0">{{ t(importParticipantsTranslationKeys.page.title) }}</h1>
      </div>

      <ParticipantImportStepper />
    </div>
  </v-container>
</template>

<style scoped>
.participant-import-page {
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
}

.participant-import-page__back {
  min-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>

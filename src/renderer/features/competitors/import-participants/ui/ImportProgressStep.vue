<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import type { ImportPreviewParticipant } from '../model/import-preview-participants'
import ImportResultEntry from './ImportResultEntry.vue'

const props = defineProps<{
  progress: number
  isComplete: boolean
  results: ImportPreviewParticipant[]
}>()

const { t } = useTranslation()

const showProgress = computed(() => !props.isComplete)
</script>

<template>
  <div class="import-progress-step">
    <div v-if="showProgress" class="import-progress-step__progress d-flex justify-center mb-4">
      <v-progress-circular
        :model-value="progress"
        :rotate="360"
        :size="100"
        :width="15"
        color="teal"
        :aria-label="t(translationKeys.steps.import.progressLabel)"
        role="progressbar"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {{ progress }}
      </v-progress-circular>
    </div>

    <ul
      v-if="results.length > 0"
      class="import-progress-step__results"
      :aria-label="t(translationKeys.steps.import.resultsListAria)"
    >
      <li v-for="participant in results" :key="participant.id">
        <ImportResultEntry :participant="participant" />
      </li>
    </ul>

    <p
      v-if="isComplete"
      class="import-progress-step__complete text-body-2 mt-3 mb-0"
      role="status"
      aria-live="polite"
    >
      {{ t(translationKeys.steps.import.complete) }}
    </p>
  </div>
</template>

<style scoped>
.import-progress-step__results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));
  gap: 0.125rem 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}
</style>

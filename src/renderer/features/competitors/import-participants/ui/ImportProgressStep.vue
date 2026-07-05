<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@shared/lib'
import type { ImportRowResult } from '@shared/types/electron-api'

import translationKeys from '../i18n/keys'
import ImportResultEntry from './ImportResultEntry.vue'

const props = defineProps<{
  progress: number
  isComplete: boolean
  results: ImportRowResult[]
  errorMessage?: string
}>()

const { t } = useTranslation()

const showProgress = computed(() => !props.isComplete && !props.errorMessage)

const importedCount = computed(() => props.results.filter((result) => result.success).length)
const failedCount = computed(() => props.results.filter((result) => !result.success).length)

const hasFailures = computed(() => failedCount.value > 0)

const summary = computed(() =>
  t(translationKeys.steps.import.summary, {
    imported: importedCount.value,
    failed: failedCount.value
  })
)
</script>

<template>
  <div class="import-progress-step">
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      density="comfortable"
      role="alert"
      class="mb-4"
    >
      {{ errorMessage }}
    </v-alert>

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
      <li v-for="participant in results" :key="participant.index">
        <ImportResultEntry :participant="participant" />
      </li>
    </ul>

    <p
      v-if="isComplete"
      class="import-progress-step__complete text-body-2 mt-3 mb-0"
      role="status"
      aria-live="polite"
    >
      {{ t(translationKeys.steps.import.complete) }} {{ summary }}
    </p>

    <p
      v-if="isComplete && hasFailures"
      class="import-progress-step__failed-hint text-body-2 text-medium-emphasis mt-1 mb-0"
    >
      {{ t(translationKeys.steps.import.failedHint) }}
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

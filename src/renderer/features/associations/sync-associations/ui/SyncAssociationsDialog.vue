<script setup lang="ts">
import { computed } from 'vue'
import { mdiCloudDownload } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import type { SyncPhase, SyncProgress, SyncResultItem } from '../model/use-sync-associations'
import SyncResultEntry from './SyncResultEntry.vue'

const props = defineProps<{
  modelValue: boolean
  phase: SyncPhase
  progress: SyncProgress
  results: SyncResultItem[]
  errorMessage: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const { t } = useTranslation()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const progressPercent = computed(() => {
  if (props.progress.total <= 0) {
    return 0
  }

  return Math.min(100, Math.round((props.progress.processed / props.progress.total) * 100))
})

const progressAriaLabel = computed(() =>
  t(translationKeys.dialog.syncing.percent, { percent: progressPercent.value })
)

const showResultsList = computed(
  () => (props.phase === 'syncing' || props.phase === 'done') && props.results.length > 0
)

function handleCancel() {
  if (props.phase === 'syncing') {
    return
  }

  emit('update:modelValue', false)
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <v-dialog
    v-model="isOpen"
    max-width="560"
    :persistent="phase === 'syncing'"
    :aria-label="t(translationKeys.dialog.title)"
  >
    <v-card class="sync-associations-dialog">
      <v-card-title class="sync-associations-dialog__title">
        <v-icon :icon="mdiCloudDownload" size="small" class="mr-2" aria-hidden="true" />
        {{ t(translationKeys.dialog.title) }}
      </v-card-title>

      <v-divider />

      <template v-if="phase === 'legal'">
        <v-card-text class="sync-associations-dialog__body">
          <p class="text-subtitle-2 mb-2">
            {{ t(translationKeys.dialog.legal.heading) }}
          </p>
          <p class="text-body-2 sync-associations-dialog__legal-body">
            {{ t(translationKeys.dialog.legal.body) }}
          </p>
          <p class="text-caption text-medium-emphasis mt-3">
            {{ t(translationKeys.dialog.legal.gdpr) }}
          </p>
          <p class="text-caption text-medium-emphasis mt-2">
            {{ t(translationKeys.dialog.legal.source) }}
          </p>

          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            density="comfortable"
            class="mt-4"
            role="alert"
          >
            {{ t(translationKeys.dialog.error) }}
          </v-alert>
        </v-card-text>

        <v-card-actions class="sync-associations-dialog__actions">
          <v-btn variant="text" @click="handleCancel">
            {{ t(translationKeys.dialog.actions.cancel) }}
          </v-btn>
          <v-spacer />
          <v-btn
            variant="flat"
            color="primary"
            :prepend-icon="mdiCloudDownload"
            @click="handleConfirm"
          >
            {{ t(translationKeys.dialog.actions.confirm) }}
          </v-btn>
        </v-card-actions>
      </template>

      <template v-else>
        <v-card-text class="sync-associations-dialog__body">
          <div v-if="phase === 'syncing'" class="sync-associations-dialog__progress">
            <v-progress-circular
              :model-value="progressPercent"
              :indeterminate="progress.total <= 0"
              color="primary"
              size="72"
              width="5"
              class="mb-3"
              :aria-label="progressAriaLabel"
              role="progressbar"
              :aria-valuenow="progressPercent"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <span class="text-body-2 font-weight-medium">{{ progressPercent }}%</span>
            </v-progress-circular>

            <p class="text-body-2 text-medium-emphasis mb-0">
              {{ t(translationKeys.dialog.syncing.loading) }}
            </p>
          </div>

          <v-alert
            v-if="phase === 'done' && errorMessage"
            type="error"
            variant="tonal"
            density="comfortable"
            class="mb-4"
            role="alert"
          >
            {{ t(translationKeys.dialog.error) }}
          </v-alert>

          <p
            v-if="phase === 'done' && results.length === 0 && !errorMessage"
            class="text-body-2 text-medium-emphasis mb-0"
            role="status"
          >
            {{ t(translationKeys.dialog.results.empty) }}
          </p>

          <ul
            v-if="showResultsList"
            class="sync-associations-dialog__results"
            :aria-label="t(translationKeys.dialog.results.listAria)"
          >
            <li v-for="item in results" :key="item.id">
              <SyncResultEntry :item="item" />
            </li>
          </ul>
        </v-card-text>

        <v-card-actions v-if="phase === 'done'" class="sync-associations-dialog__actions">
          <v-spacer />
          <v-btn variant="flat" color="primary" @click="handleCancel">
            {{ t(translationKeys.dialog.actions.close) }}
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.sync-associations-dialog__title {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem 0.75rem;
}

.sync-associations-dialog__body {
  padding: 1.25rem;
}

.sync-associations-dialog__progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 7rem;
  margin-bottom: 1rem;
}

.sync-associations-dialog__legal-body {
  white-space: pre-line;
}

.sync-associations-dialog__actions {
  padding: 0.5rem 1rem 1rem;
}

.sync-associations-dialog__results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));
  gap: 0.125rem 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 18rem;
  overflow: auto;
  width: 100%;
}
</style>

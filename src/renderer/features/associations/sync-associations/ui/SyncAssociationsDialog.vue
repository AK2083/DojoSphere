<script setup lang="ts">
import { computed } from 'vue'
import { mdiCloudSync } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import type { SyncPhase, SyncProgress } from '../model/use-sync-associations'

const props = defineProps<{
  modelValue: boolean
  phase: SyncPhase
  progress: SyncProgress
  errorMessage: string | null
  isNotSignedIn: boolean
  syncedCount: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  close: []
  done: []
}>()

const { t } = useTranslation()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function handleCancel() {
  emit('update:modelValue', false)
}

function handleConfirm() {
  emit('confirm')
}

function handleClose() {
  emit('close')
  emit('done')
  emit('update:modelValue', false)
}

const progressLabel = computed(() =>
  t(translationKeys.dialog.syncing.progress, {
    processed: props.progress.processed,
    total: props.progress.total
  })
)

const currentLabel = computed(() =>
  props.progress.currentName
    ? t(translationKeys.dialog.syncing.current, { name: props.progress.currentName })
    : ''
)

const doneMessage = computed(() =>
  props.syncedCount > 0
    ? t(translationKeys.dialog.done.message, { count: props.syncedCount })
    : t(translationKeys.dialog.done.nothingNew)
)
</script>

<template>
  <v-dialog
    v-model="isOpen"
    max-width="540"
    :persistent="phase === 'syncing'"
    :aria-label="t(translationKeys.dialog.title)"
  >
    <v-card class="sync-associations-dialog">
      <!-- Header -->
      <v-card-title class="sync-associations-dialog__title">
        <v-icon :icon="mdiCloudSync" size="small" class="mr-2" aria-hidden="true" />
        {{ t(translationKeys.dialog.title) }}
      </v-card-title>

      <v-divider />

      <!-- LEGAL PHASE -->
      <template v-if="phase === 'legal'">
        <v-card-text class="sync-associations-dialog__body">
          <p class="text-subtitle-2 mb-2">
            {{ t(translationKeys.dialog.legal.heading) }}
          </p>
          <p class="text-body-2 sync-associations-dialog__legal-body">
            {{ t(translationKeys.dialog.legal.body) }}
          </p>
          <p class="text-caption text-medium-emphasis mt-3">
            {{ t(translationKeys.dialog.legal.source) }}
          </p>

          <v-alert
            v-if="isNotSignedIn"
            type="warning"
            variant="tonal"
            density="comfortable"
            class="mt-4"
            role="alert"
          >
            {{ t(translationKeys.dialog.notSignedIn) }}
          </v-alert>

          <v-alert
            v-else-if="errorMessage"
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
          <v-btn variant="flat" color="primary" :prepend-icon="mdiCloudSync" @click="handleConfirm">
            {{ t(translationKeys.dialog.actions.confirm) }}
          </v-btn>
        </v-card-actions>
      </template>

      <!-- SYNCING PHASE -->
      <template v-else-if="phase === 'syncing'">
        <v-card-text
          class="sync-associations-dialog__body sync-associations-dialog__body--centered"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            class="mb-6"
            aria-label="Synchronising associations"
          />

          <p
            v-if="progress.total > 0"
            class="text-body-1 font-weight-medium sync-associations-dialog__progress-label"
          >
            {{ progressLabel }}
          </p>
          <p v-else class="text-body-2 text-medium-emphasis">&nbsp;</p>

          <p
            v-if="currentLabel"
            class="text-body-2 text-medium-emphasis mt-1 sync-associations-dialog__current-name"
          >
            {{ currentLabel }}
          </p>
        </v-card-text>
      </template>

      <!-- DONE PHASE -->
      <template v-else-if="phase === 'done'">
        <v-card-text class="sync-associations-dialog__body">
          <v-alert type="success" variant="tonal" density="comfortable">
            {{ doneMessage }}
          </v-alert>
        </v-card-text>

        <v-card-actions class="sync-associations-dialog__actions">
          <v-spacer />
          <v-btn variant="flat" color="primary" @click="handleClose">
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

.sync-associations-dialog__body--centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1.25rem;
}

.sync-associations-dialog__legal-body {
  white-space: pre-line;
}

.sync-associations-dialog__actions {
  padding: 0.5rem 1rem 1rem;
}

.sync-associations-dialog__progress-label {
  min-height: 1.5rem;
}

.sync-associations-dialog__current-name {
  min-height: 1.25rem;
  max-width: 28rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useParticipantImportContext } from '../model/use-participant-import'

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const { isPreviewing, previewError, preview, selectFile } = useParticipantImportContext()

const selectedFile = ref<File[]>([])

const isMobile = computed(() => smAndDown.value)

const statusText = computed(() => {
  if (isPreviewing.value) {
    return t(translationKeys.steps.file.analyzing)
  }

  if (preview.value) {
    return t(translationKeys.steps.file.ready)
  }

  return ''
})

function handleFileChange(value: File[] | File): void {
  const files = Array.isArray(value) ? value : [value]

  void selectFile(files[0] ?? null)
}
</script>

<template>
  <div class="import-file-step">
    <v-file-input
      v-model="selectedFile"
      :label="t(translationKeys.steps.file.inputLabel)"
      :hint="t(translationKeys.steps.file.hint)"
      persistent-hint
      accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
      prepend-icon=""
      :disabled="isPreviewing"
      :aria-label="t(translationKeys.steps.file.ariaInput)"
      @update:model-value="handleFileChange"
    />

    <div
      v-if="isPreviewing || statusText"
      class="import-file-step__status mt-4"
      :class="{ 'import-file-step__status--stacked': isMobile }"
    >
      <v-progress-circular
        v-if="isPreviewing"
        indeterminate
        :size="40"
        :width="4"
        color="teal"
        :aria-label="t(translationKeys.steps.file.reading)"
      />
      <span class="import-file-step__status-text text-body-2" role="status" aria-live="polite">
        {{ statusText }}
      </span>
    </div>

    <v-alert
      v-if="previewError"
      type="error"
      variant="tonal"
      density="comfortable"
      role="alert"
      class="mt-4"
    >
      {{ previewError }}
    </v-alert>
  </div>
</template>

<style scoped>
.import-file-step__status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.import-file-step__status--stacked {
  flex-direction: column;
  align-items: flex-start;
}

.import-file-step__status-text {
  min-width: 0;
}
</style>

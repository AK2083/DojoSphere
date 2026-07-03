<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { mdiArrowLeftRight, mdiCancel, mdiCheck, mdiFileImport, mdiMicrosoftExcel } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useParticipantImport } from '../model/use-participant-import'
import ImportFileStep from './ImportFileStep.vue'
import ImportMappingStep from './ImportMappingStep.vue'
import ImportProgressStep from './ImportProgressStep.vue'
import ImportStepSection from './ImportStepSection.vue'

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const { step, importProgress, isImportComplete, visibleResults, goNext, finish, cancel } =
  useParticipantImport()

const isMobile = computed(() => smAndDown.value)

const showActions = computed(() => step.value < 2 || isImportComplete.value)

const isFinishAction = computed(() => step.value === 2 && isImportComplete.value)

const primaryActionLabel = computed(() =>
  isFinishAction.value ? t(translationKeys.actions.finish) : t(translationKeys.actions.next)
)

const primaryActionAriaLabel = computed(() =>
  isFinishAction.value ? t(translationKeys.actions.ariaFinish) : t(translationKeys.actions.ariaNext)
)

function handlePrimaryAction(): void {
  if (isFinishAction.value) {
    finish()
    return
  }

  goNext()
}
</script>

<template>
  <div class="participant-import-stepper-shell">
    <v-stepper
      v-model="step"
      alt-labels
      elevation="0"
      class="participant-import-stepper"
      :mobile="isMobile"
    >
      <v-stepper-header>
        <v-stepper-item :value="0" :complete="step > 0">
          <template #title>{{ t(translationKeys.steps.file.title) }}</template>
        </v-stepper-item>

        <v-divider />

        <v-stepper-item :value="1" :complete="step > 1">
          <template #title>{{ t(translationKeys.steps.mapping.title) }}</template>
        </v-stepper-item>

        <v-divider />

        <v-stepper-item :value="2" :complete="isImportComplete">
          <template #title>{{ t(translationKeys.steps.import.title) }}</template>
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item :value="0" class="participant-import-stepper__window-item">
          <ImportStepSection
            :title="t(translationKeys.steps.file.title)"
            :subtitle="t(translationKeys.steps.file.description)"
            :icon="mdiMicrosoftExcel"
          >
            <ImportFileStep />
          </ImportStepSection>
        </v-stepper-window-item>

        <v-stepper-window-item :value="1" class="participant-import-stepper__window-item">
          <ImportStepSection
            :title="t(translationKeys.steps.mapping.title)"
            :subtitle="t(translationKeys.steps.mapping.description)"
            :icon="mdiArrowLeftRight"
          >
            <ImportMappingStep />
          </ImportStepSection>
        </v-stepper-window-item>

        <v-stepper-window-item :value="2" class="participant-import-stepper__window-item">
          <ImportStepSection
            :title="t(translationKeys.steps.import.title)"
            :subtitle="t(translationKeys.steps.import.description)"
            :icon="mdiFileImport"
          >
            <ImportProgressStep
              :progress="importProgress"
              :is-complete="isImportComplete"
              :results="visibleResults"
            />
          </ImportStepSection>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>

    <div
      v-if="showActions"
      class="participant-import-stepper__actions d-flex justify-space-between px-4 pb-2 pt-1"
    >
      <v-btn
        :prepend-icon="mdiCancel"
        :aria-label="t(translationKeys.actions.ariaCancel)"
        variant="text"
        @click="cancel"
      >
        {{ t(translationKeys.actions.cancel) }}
      </v-btn>

      <v-btn
        variant="text"
        :aria-label="primaryActionAriaLabel"
        :prepend-icon="mdiCheck"
        color="primary"
        @click="handlePrimaryAction"
      >
        {{ primaryActionLabel }}
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.participant-import-stepper-shell {
  border: thin solid rgba(var(--v-theme-on-surface), 0.38);
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  overflow: hidden;
}

.participant-import-stepper {
  border: none;
  background: transparent;
}

.participant-import-stepper :deep(.v-stepper),
.participant-import-stepper :deep(.v-stepper-header),
.participant-import-stepper :deep(.v-stepper-window),
.participant-import-stepper :deep(.v-stepper-window-item) {
  background: transparent;
  box-shadow: none;
}

.participant-import-stepper :deep(.v-stepper-header) {
  margin-bottom: 0;
  padding-bottom: 0;
}

.participant-import-stepper :deep(.v-stepper-window) {
  margin-top: 0;
}

.participant-import-stepper :deep(.v-stepper-window-item) {
  padding-top: 0;
}

.participant-import-stepper__window-item {
  padding: 0.25rem 1rem 0.5rem;
}

.participant-import-stepper__actions {
  border-top: thin solid rgba(var(--v-theme-on-surface), 0.12);
}
</style>

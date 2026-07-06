<script setup lang="ts">
import { computed } from 'vue'
import { mdiCheck, mdiClose } from '@mdi/js'
import { useTranslation } from '@shared/lib'
import type { ImportRowResult } from '@shared/types/electron-api'

import translationKeys from '../i18n/keys'
import { importRowErrorTranslationKey } from '../model/resolve-import-error'

const props = defineProps<{
  participant: ImportRowResult
}>()

const { t } = useTranslation()

const fullName = computed(() => `${props.participant.givenName} ${props.participant.familyName}`)

const statusIcon = computed(() => (props.participant.success ? mdiCheck : mdiClose))

const statusColor = computed(() => (props.participant.success ? 'success' : 'error'))

const statusLabel = computed(() =>
  props.participant.success
    ? t(translationKeys.steps.import.statusSuccess, { name: fullName.value })
    : t(translationKeys.steps.import.statusFailure, { name: fullName.value })
)

const rowErrorHint = computed(() => {
  const key = importRowErrorTranslationKey(props.participant.errorCode)

  return key ? t(key) : undefined
})
</script>

<template>
  <div class="import-result-entry">
    <v-icon
      :icon="statusIcon"
      :color="statusColor"
      size="x-small"
      class="import-result-entry__icon"
      :aria-label="statusLabel"
    />

    <div class="import-result-entry__content">
      <span class="import-result-entry__name">{{ fullName }}</span>
      <span class="import-result-entry__club text-medium-emphasis">{{ participant.club }}</span>
      <span v-if="rowErrorHint" class="import-result-entry__error text-medium-emphasis">
        {{ rowErrorHint }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.import-result-entry {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  min-width: 0;
}

.import-result-entry__icon {
  margin-top: 0.125rem;
}

.import-result-entry__content {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
}

.import-result-entry__name {
  font-size: 0.8125rem;
  line-height: 1.3;
}

.import-result-entry__club {
  font-size: 0.75rem;
  line-height: 1.25;
}

.import-result-entry__error {
  font-size: 0.75rem;
  line-height: 1.25;
}
</style>

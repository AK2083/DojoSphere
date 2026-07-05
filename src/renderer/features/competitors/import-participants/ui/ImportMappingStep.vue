<script setup lang="ts">
import { computed } from 'vue'
import {
  type ImportTargetFieldKey,
  isExcludedImportSourceLabel,
  isParticipantFormRequiredImportField,
  usesImportDefaultWhenUnmapped
} from '@shared/domain/competitor-import-fields'
import { useTranslation } from '@shared/lib'
import type { ImportPreviewColumn } from '@shared/types/electron-api'
import RequiredFieldLabel from '@shared/ui/RequiredFieldLabel.vue'

import saveParticipantTranslationKeys from '../../save-participant/i18n/keys'
import translationKeys from '../i18n/keys'
import { importDefaultValueLabel } from '../model/import-mapping-default-hints'
import { targetFieldLabelKey } from '../model/import-mapping-options'
import { useParticipantImportContext } from '../model/use-participant-import'

const { t } = useTranslation()
const { preview, mapping, sources, mappingValid, missingRequiredFieldKeys, setMapping } =
  useParticipantImportContext()

const columns = computed(() => preview.value?.columns ?? [])
const fields = computed(() => preview.value?.fields ?? [])
const rowCount = computed(() => preview.value?.rowCount ?? 0)

const hasMultipleSheets = computed(
  () => new Set(columns.value.map((column) => column.sheetName)).size > 1
)

const mappableColumns = computed(() =>
  columns.value.filter((column) => !isExcludedImportSourceLabel(column.header))
)

const columnOptions = computed(() => [
  { title: t(translationKeys.steps.mapping.notMapped), value: '' },
  ...mappableColumns.value.map((column) => ({
    title: sourceOptionLabel(column),
    value: column.id
  }))
])

function sourceOptionLabel(column: ImportPreviewColumn): string {
  const header = column.header || t(translationKeys.steps.mapping.unnamedColumn)

  if (column.sourceKind === 'form') {
    const value = column.sampleValues[0]

    if (value) {
      return `${header} — ${value} (${t(translationKeys.steps.mapping.formField)})`
    }

    return `${header} (${t(translationKeys.steps.mapping.formField)})`
  }

  if (hasMultipleSheets.value) {
    return `${header} (${column.sheetName})`
  }

  return header
}

function assignedColumn(fieldKey: string): string {
  return mapping.value[fieldKey] ?? ''
}

function badgeLabel(fieldKey: string): string {
  const source = sources.value[fieldKey]

  if (source === 'manual') {
    return t(translationKeys.steps.mapping.badge.manual)
  }

  if (source === 'data') {
    return t(translationKeys.steps.mapping.badge.data)
  }

  return t(translationKeys.steps.mapping.badge.header)
}

function badgeColor(fieldKey: string): string {
  return sources.value[fieldKey] === 'manual' ? 'primary' : 'secondary'
}

function sampleValuesForColumn(columnId: string): string {
  const column = columns.value.find((entry) => entry.id === columnId)

  if (!column || column.sourceKind === 'form') {
    return ''
  }

  const uniqueSamples = [...new Set(column.sampleValues.filter(Boolean))]

  return uniqueSamples.slice(0, 4).join(', ')
}

const sampleOwnerByColumnId = computed(() => {
  const owners = new Map<string, string>()

  for (const field of fields.value) {
    const columnId = mapping.value[field.key]

    if (columnId && !owners.has(columnId)) {
      owners.set(columnId, field.key)
    }
  }

  return owners
})

function shouldShowSample(fieldKey: string): boolean {
  const columnId = assignedColumn(fieldKey)

  if (!columnId) {
    return false
  }

  return sampleOwnerByColumnId.value.get(columnId) === fieldKey
}

function sampleForField(fieldKey: string): string {
  if (!shouldShowSample(fieldKey)) {
    return ''
  }

  return sampleValuesForColumn(assignedColumn(fieldKey))
}

const missingFieldLabels = computed(() =>
  missingRequiredFieldKeys.value.map((key) => t(targetFieldLabelKey(key))).join(', ')
)

function onColumnChange(fieldKey: string, value: unknown): void {
  setMapping(fieldKey, typeof value === 'string' ? value : '')
}

function showsFormRequiredMarker(fieldKey: string): boolean {
  return isParticipantFormRequiredImportField(fieldKey as ImportTargetFieldKey)
}

function usesDefaultWhenUnmapped(fieldKey: string): boolean {
  return usesImportDefaultWhenUnmapped(fieldKey as ImportTargetFieldKey)
}

function defaultHint(fieldKey: string): string {
  const value = importDefaultValueLabel(fieldKey as ImportTargetFieldKey, t)

  if (!value) {
    return ''
  }

  return t(translationKeys.steps.mapping.defaultApplied, { value })
}
</script>

<template>
  <div class="import-mapping-step">
    <p class="text-body-2 text-medium-emphasis mb-3">
      {{ t(translationKeys.steps.mapping.rowCount, { count: rowCount }) }}
    </p>

    <v-alert
      v-if="!mappingValid"
      type="warning"
      variant="tonal"
      density="comfortable"
      role="alert"
      class="mb-4"
    >
      {{ t(translationKeys.steps.mapping.missingRequired, { fields: missingFieldLabels }) }}
    </v-alert>

    <p class="import-mapping-step__required-legend text-body-2 text-medium-emphasis mb-3">
      {{ t(saveParticipantTranslationKeys.form.requiredFieldsLegend) }}
    </p>

    <ul class="import-mapping-step__list">
      <li v-for="field in fields" :key="field.key" class="import-mapping-step__row">
        <div class="import-mapping-step__target">
          <RequiredFieldLabel
            v-if="showsFormRequiredMarker(field.key)"
            class="import-mapping-step__field-label"
            :text="t(targetFieldLabelKey(field.key))"
          />
          <span v-else class="import-mapping-step__field-label">
            {{ t(targetFieldLabelKey(field.key)) }}
          </span>
          <span
            v-if="sampleForField(field.key)"
            class="import-mapping-step__sample text-medium-emphasis"
          >
            {{ t(translationKeys.steps.mapping.sampleLabel) }}: {{ sampleForField(field.key) }}
          </span>
          <span
            v-else-if="!assignedColumn(field.key) && usesDefaultWhenUnmapped(field.key)"
            class="import-mapping-step__default-hint text-info"
          >
            {{ defaultHint(field.key) }}
          </span>
        </div>

        <div class="import-mapping-step__control">
          <v-select
            :model-value="assignedColumn(field.key)"
            :items="columnOptions"
            item-title="title"
            item-value="value"
            :label="t(translationKeys.steps.mapping.sourceLabel)"
            :aria-label="`${t(translationKeys.steps.mapping.ariaSource)}: ${t(targetFieldLabelKey(field.key))}`"
            density="comfortable"
            hide-details
            class="import-mapping-step__select"
            @update:model-value="(value) => onColumnChange(field.key, value)"
          />
          <v-chip
            v-if="assignedColumn(field.key)"
            size="x-small"
            :color="badgeColor(field.key)"
            variant="tonal"
            class="import-mapping-step__badge"
          >
            {{ badgeLabel(field.key) }}
          </v-chip>
          <v-chip
            v-else-if="usesDefaultWhenUnmapped(field.key)"
            size="x-small"
            color="info"
            variant="tonal"
            class="import-mapping-step__badge"
          >
            {{ t(translationKeys.steps.mapping.badge.default) }}
          </v-chip>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.import-mapping-step__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.import-mapping-step__row {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.75rem 0;
  border-top: thin solid rgba(var(--v-theme-on-surface), 0.08);
}

.import-mapping-step__target {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.import-mapping-step__field-label {
  display: inline-block;
  font-weight: 600;
  word-break: break-word;
}

.import-mapping-step__sample {
  font-size: 0.75rem;
}

.import-mapping-step__default-hint {
  font-size: 0.75rem;
  font-weight: 500;
}

.import-mapping-step__control {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  width: 100%;
}

.import-mapping-step__select {
  width: 100%;
}
</style>

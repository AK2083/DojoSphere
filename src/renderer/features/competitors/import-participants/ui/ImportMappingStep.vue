<script setup lang="ts">
import { computed, ref } from 'vue'
import { mdiArrowRight } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import {
  SOURCE_COLUMN_KEYS,
  SOURCE_COLUMN_TRANSLATION_KEY,
  type SourceColumnKey,
  TARGET_FIELD_KEYS,
  TARGET_FIELD_TRANSLATION_KEY,
  type TargetFieldKey
} from '../model/import-mapping-options'

const { t } = useTranslation()

const sourceColumn = ref<SourceColumnKey>('givenName')
const targetField = ref<TargetFieldKey>('givenName')

const sourceOptions = computed(() =>
  SOURCE_COLUMN_KEYS.map((key) => ({
    title: t(SOURCE_COLUMN_TRANSLATION_KEY[key]),
    value: key
  }))
)

const targetOptions = computed(() =>
  TARGET_FIELD_KEYS.map((key) => ({
    title: t(TARGET_FIELD_TRANSLATION_KEY[key]),
    value: key
  }))
)
</script>

<template>
  <div class="import-mapping-step">
    <div class="import-mapping-step__row">
      <v-select
        v-model="sourceColumn"
        :items="sourceOptions"
        item-title="title"
        item-value="value"
        :label="t(translationKeys.steps.mapping.sourceLabel)"
        :aria-label="t(translationKeys.steps.mapping.ariaSource)"
        density="comfortable"
        hide-details
        class="import-mapping-step__select"
      />

      <v-icon
        :icon="mdiArrowRight"
        class="import-mapping-step__arrow text-medium-emphasis"
        aria-hidden="true"
      />

      <v-select
        v-model="targetField"
        :items="targetOptions"
        item-title="title"
        item-value="value"
        :label="t(translationKeys.steps.mapping.targetLabel)"
        :aria-label="t(translationKeys.steps.mapping.ariaTarget)"
        density="comfortable"
        hide-details
        class="import-mapping-step__select"
      />
    </div>
  </div>
</template>

<style scoped>
.import-mapping-step__row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.import-mapping-step__select {
  flex: 1 1 0;
  min-width: 0;
}

.import-mapping-step__arrow {
  flex: 0 0 auto;
}
</style>

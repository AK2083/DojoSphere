<script setup lang="ts">
import { computed } from 'vue'
import { mdiCheck, mdiCircleOutline, mdiClose } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import type { SyncResultItem } from '../model/use-sync-associations'

const props = defineProps<{
  item: SyncResultItem
}>()

const { t } = useTranslation()

const statusIcon = computed(() => {
  if (props.item.success === true) {
    return mdiCheck
  }

  if (props.item.success === false) {
    return mdiClose
  }

  return mdiCircleOutline
})

const statusColor = computed(() => {
  if (props.item.success === true) {
    return 'success'
  }

  if (props.item.success === false) {
    return 'error'
  }

  return undefined
})

const statusLabel = computed(() => {
  if (props.item.success === true) {
    return t(translationKeys.dialog.results.statusSuccess, { name: props.item.name })
  }

  if (props.item.success === false) {
    return t(translationKeys.dialog.results.statusFailure, { name: props.item.name })
  }

  return t(translationKeys.dialog.results.statusPending, { name: props.item.name })
})
</script>

<template>
  <div class="sync-result-entry">
    <v-icon
      :icon="statusIcon"
      :color="statusColor"
      size="x-small"
      class="sync-result-entry__icon"
      :aria-label="statusLabel"
    />
    <span class="sync-result-entry__name">{{ item.name }}</span>
  </div>
</template>

<style scoped>
.sync-result-entry {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  min-width: 0;
}

.sync-result-entry__icon {
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.sync-result-entry__name {
  font-size: 0.8125rem;
  line-height: 1.3;
  min-width: 0;
  overflow-wrap: anywhere;
}
</style>

<script setup lang="ts">
import { mdiDelete, mdiPencil, mdiPlus } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { participantLabel } from '../lib/participant-label'
import type {
  ParticipantOverviewHeader,
  ParticipantTableRow,
  ParticipantTableSortItem
} from '../model/use-participant-overview'

defineProps<{
  headers: ParticipantOverviewHeader[]
  items: ParticipantTableRow[]
  loading: boolean
}>()

const sortBy = defineModel<ParticipantTableSortItem[]>('sortBy', { required: true })

const emit = defineEmits<{
  add: []
  edit: [participant: ParticipantTableRow]
  delete: [participant: ParticipantTableRow]
}>()

const { t } = useTranslation()
</script>

<template>
  <v-data-table
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="items"
    :loading="loading"
    :loading-text="t(translationKeys.table.loading)"
    gridlines="horizontal"
    striped="even"
    item-value="id"
    must-sort
    class="participant-list-table border rounded"
    :aria-label="t(translationKeys.table.ariaLabel)"
  >
    <template #top>
      <v-toolbar density="comfortable" flat :aria-label="t(translationKeys.toolbar.ariaLabel)">
        <v-spacer />
        <v-btn rounded :prepend-icon="mdiPlus" @click="emit('add')">
          {{ t(translationKeys.actions.add) }}
        </v-btn>
      </v-toolbar>
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="d-flex ga-1 justify-end">
        <v-btn
          icon
          size="small"
          :aria-label="t(translationKeys.actions.ariaEdit, { name: participantLabel(item) })"
          @click="emit('edit', item)"
        >
          <v-icon :icon="mdiPencil" aria-hidden="true" />
        </v-btn>

        <v-btn
          icon
          size="small"
          :aria-label="t(translationKeys.actions.ariaDelete, { name: participantLabel(item) })"
          @click="emit('delete', item)"
        >
          <v-icon :icon="mdiDelete" aria-hidden="true" />
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<style scoped>
.participant-list-table {
  width: 100%;
}
</style>

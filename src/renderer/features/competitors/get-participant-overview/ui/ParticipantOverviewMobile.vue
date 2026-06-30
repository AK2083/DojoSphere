<script setup lang="ts">
import { computed, ref } from 'vue'
import { mdiChevronDown, mdiChevronUp, mdiDelete, mdiPencil, mdiPlus } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { participantAvatarColor, participantInitials } from '../lib/participant-avatar'
import { participantLabel } from '../lib/participant-label'
import type {
  ParticipantOverviewHeader,
  ParticipantTableRow,
  ParticipantTableSortItem
} from '../model/use-participant-overview'

const props = defineProps<{
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

const mobileSummaryFieldKeys = [
  'club',
  'weightClass',
  'ageClass',
  'gender',
  'grade',
  'passNumber'
] as const

const mobileSecondaryFieldKeys = [
  'birthDate',
  'nationality',
  'licenseNumber',
  'coach',
  'clubContactEmail',
  'contactPhone'
] as const

function mobileHeadersForKeys(keys: readonly string[]) {
  return keys
    .map((key) => props.headers.find((header) => header.key === key))
    .filter((header): header is ParticipantOverviewHeader => header != null)
}

const mobileSummaryHeaders = computed(() => mobileHeadersForKeys(mobileSummaryFieldKeys))

const mobileSecondaryHeaders = computed(() => mobileHeadersForKeys(mobileSecondaryFieldKeys))

const expandedDetailsIds = ref<Set<string>>(new Set())

function isDetailsExpanded(participantId: string): boolean {
  return expandedDetailsIds.value.has(participantId)
}

function toggleDetailsExpanded(participantId: string): void {
  const nextExpandedIds = new Set(expandedDetailsIds.value)

  if (nextExpandedIds.has(participantId)) {
    nextExpandedIds.delete(participantId)
  } else {
    nextExpandedIds.add(participantId)
  }

  expandedDetailsIds.value = nextExpandedIds
}

function mobileDetailsPanelId(participantId: string): string {
  return `participant-details-${participantId}`
}

function rowProps() {
  return { class: 'participant-list-mobile__row' }
}

function mobileFieldValue(participant: Record<string, string>, key: string): string {
  return participant[key] ?? ''
}
</script>

<template>
  <v-data-table
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="items"
    :loading="loading"
    :loading-text="t(translationKeys.table.loading)"
    mobile
    :gridlines="false"
    striped="even"
    :row-props="rowProps"
    item-value="id"
    must-sort
    class="participant-list-mobile"
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

    <template #item="{ item, props: rowBind }">
      <tr v-bind="rowBind" :aria-label="participantLabel(item)">
        <td class="participant-list-mobile__row-card pa-0" :colspan="headers.length">
          <div class="participant-list-mobile__row-header pa-2">
            <div class="participant-list-mobile__row-identity">
              <v-avatar
                :color="participantAvatarColor(item.club)"
                size="40"
                class="participant-list-mobile__row-avatar"
              >
                <span aria-hidden="true">{{ participantInitials(item) }}</span>
              </v-avatar>
              <p class="participant-list-mobile__row-title">
                {{ participantLabel(item) }}
              </p>
            </div>

            <div class="participant-list-mobile__row-actions">
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
                :aria-label="
                  t(translationKeys.actions.ariaDelete, { name: participantLabel(item) })
                "
                @click="emit('delete', item)"
              >
                <v-icon :icon="mdiDelete" aria-hidden="true" />
              </v-btn>
            </div>
          </div>

          <dl class="participant-list-mobile__row-summary pa-2">
            <template v-for="header in mobileSummaryHeaders" :key="header.key">
              <dt>{{ header.title }}</dt>
              <dd>{{ mobileFieldValue(item, header.key) }}</dd>
            </template>
          </dl>

          <div class="participant-list-mobile__row-details-toggle">
            <v-btn
              variant="text"
              block
              class="participant-list-mobile__row-details-toggle-btn"
              :aria-expanded="isDetailsExpanded(item.id)"
              :aria-controls="mobileDetailsPanelId(item.id)"
              @click="toggleDetailsExpanded(item.id)"
            >
              {{
                isDetailsExpanded(item.id)
                  ? t(translationKeys.mobile.hideDetails)
                  : t(translationKeys.mobile.showDetails)
              }}
              <v-icon
                :icon="isDetailsExpanded(item.id) ? mdiChevronUp : mdiChevronDown"
                end
                aria-hidden="true"
              />
            </v-btn>
          </div>

          <v-expand-transition>
            <dl
              v-if="isDetailsExpanded(item.id)"
              :id="mobileDetailsPanelId(item.id)"
              class="participant-list-mobile__row-details pa-2 pt-0"
            >
              <template v-for="header in mobileSecondaryHeaders" :key="header.key">
                <dt>{{ header.title }}</dt>
                <dd>{{ mobileFieldValue(item, header.key) }}</dd>
              </template>
            </dl>
          </v-expand-transition>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<style scoped>
.participant-list-mobile {
  width: 100%;
  border: none;
  background-color: rgb(var(--v-theme-background));
}

.participant-list-mobile :deep(.v-data-table),
.participant-list-mobile :deep(.v-table),
.participant-list-mobile :deep(.v-table__wrapper),
.participant-list-mobile :deep(table),
.participant-list-mobile :deep(tbody) {
  background: rgb(var(--v-theme-background));
  background-color: rgb(var(--v-theme-background));
}

.participant-list-mobile :deep(tbody) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.participant-list-mobile :deep(table) {
  border-collapse: separate;
  border-spacing: 0;
}

.participant-list-mobile :deep(.v-toolbar) {
  margin-bottom: 1rem;
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  overflow: hidden;
}

.participant-list-mobile :deep(> .v-divider) {
  display: none;
}

.participant-list-mobile :deep(> .v-table__wrapper) {
  border-top: none;
}

.participant-list-mobile :deep(.v-data-table-footer) {
  margin-top: 1rem;
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
}

.participant-list-mobile :deep(.v-table__wrapper thead th) {
  border-bottom: none;
}

.participant-list-mobile :deep(tr.participant-list-mobile__row) {
  display: block;
  margin-bottom: 0;
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  overflow: hidden;
}

.participant-list-mobile :deep(tr.participant-list-mobile__row:first-child) {
  margin-top: 0;
}

.participant-list-mobile :deep(tr.participant-list-mobile__row:nth-child(even)) {
  background-color: rgb(var(--v-theme-surface));
  background-image: linear-gradient(
    0deg,
    rgba(var(--v-border-color), var(--v-hover-opacity)),
    rgba(var(--v-border-color), var(--v-hover-opacity))
  );
}

.participant-list-mobile :deep(tr.participant-list-mobile__row > td) {
  height: auto;
  padding: 0;
}

.participant-list-mobile :deep(.participant-list-mobile__row-card) {
  display: block;
  background: transparent;
  border: none;
}

.participant-list-mobile :deep(.participant-list-mobile__row-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.participant-list-mobile :deep(.participant-list-mobile__row-identity) {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  min-width: 0;
}

.participant-list-mobile :deep(.participant-list-mobile__row-avatar) {
  flex-shrink: 0;
}

.participant-list-mobile :deep(.participant-list-mobile__row-avatar .v-avatar__underlay),
.participant-list-mobile :deep(.participant-list-mobile__row-avatar .v-avatar__content) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.participant-list-mobile :deep(.participant-list-mobile__row-title) {
  display: flex;
  flex: 1;
  align-items: center;
  margin: 0;
  min-height: 2.5rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
}

.participant-list-mobile :deep(.participant-list-mobile__row-actions) {
  display: flex;
  flex-shrink: 0;
  gap: 0.25rem;
}

.participant-list-mobile :deep(.participant-list-mobile__row-summary),
.participant-list-mobile :deep(.participant-list-mobile__row-details) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 1rem;
  row-gap: 0.5rem;
  margin: 0;
}

.participant-list-mobile :deep(.participant-list-mobile__row-summary) {
  border-bottom: none;
}

.participant-list-mobile :deep(.participant-list-mobile__row-details-toggle) {
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.participant-list-mobile :deep(.participant-list-mobile__row-details-toggle-btn.v-btn) {
  justify-content: flex-start;
  height: auto;
  min-height: unset;
  padding: 1rem;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

.participant-list-mobile :deep(.participant-list-mobile__row-summary dt),
.participant-list-mobile :deep(.participant-list-mobile__row-details dt) {
  margin: 0;
  font-weight: 600;
}

.participant-list-mobile :deep(.participant-list-mobile__row-summary dd),
.participant-list-mobile :deep(.participant-list-mobile__row-details dd) {
  margin: 0;
  text-align: left;
}

.participant-list-mobile :deep(.participant-list-mobile__row-details dt),
.participant-list-mobile :deep(.participant-list-mobile__row-details dd) {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.participant-list-mobile :deep(.participant-list-mobile__row-details dt) {
  font-weight: 500;
}

.participant-list-mobile :deep(tr.participant-list-mobile__row:last-child) {
  margin-bottom: 0;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { mdiChevronDown, mdiChevronUp, mdiDelete, mdiPencil } from '@mdi/js'
import { useTranslation } from '@shared/lib'
import JudoBeltSwatch from '@shared/ui/JudoBeltSwatch.vue'

import translationKeys from '../i18n/keys'
import {
  participantAvatarColor,
  participantClubHeaderBackground,
  participantInitials
} from '../lib/participant-avatar'
import { participantLabel } from '../lib/participant-label'
import type {
  ParticipantFieldHeader,
  ParticipantOverviewItem
} from '../model/use-participant-overview'

const props = defineProps<{
  participant: ParticipantOverviewItem
  fieldHeaders: ParticipantFieldHeader[]
}>()

const emit = defineEmits<{
  edit: [participant: ParticipantOverviewItem]
  delete: [participant: ParticipantOverviewItem]
}>()

const { t } = useTranslation()

const summaryFieldKeys = ['weightClass', 'ageClass', 'gender', 'grade', 'passNumber'] as const

const secondaryFieldKeys = [
  'birthDate',
  'nationality',
  'licenseNumber',
  'coach',
  'clubContactEmail',
  'contactPhone'
] as const

function headersForKeys(keys: readonly string[]) {
  return keys
    .map((key) => props.fieldHeaders.find((header) => header.key === key))
    .filter((header): header is ParticipantFieldHeader => header != null)
}

const summaryHeaders = computed(() => headersForKeys(summaryFieldKeys))
const secondaryHeaders = computed(() => headersForKeys(secondaryFieldKeys))

const detailsExpanded = ref(false)
const clubColor = computed(() => participantAvatarColor(props.participant.club))
const headerBackground = computed(() => participantClubHeaderBackground(props.participant.club))

function fieldValue(key: string): string {
  return props.participant[key as keyof ParticipantOverviewItem]?.toString() ?? ''
}

function detailsPanelId(): string {
  return `participant-details-${props.participant.id}`
}
</script>

<template>
  <v-card variant="outlined" class="participant-entry" :aria-label="participantLabel(participant)">
    <div class="participant-entry__header" :style="{ backgroundColor: headerBackground }">
      <div class="participant-entry__identity">
        <v-avatar :color="clubColor" size="40" class="participant-entry__avatar">
          <span aria-hidden="true">{{ participantInitials(participant) }}</span>
        </v-avatar>
        <div class="participant-entry__name-block">
          <p class="participant-entry__title">
            {{ participantLabel(participant) }}
          </p>
          <p v-if="participant.club" class="participant-entry__club">
            {{ participant.club }}
          </p>
        </div>
      </div>

      <div class="participant-entry__actions">
        <v-tooltip :text="t(translationKeys.actions.edit)" location="bottom">
          <template #activator="{ props: tooltipProps }">
            <v-icon-btn
              v-bind="tooltipProps"
              :icon="mdiPencil"
              variant="text"
              :aria-label="
                t(translationKeys.actions.ariaEdit, { name: participantLabel(participant) })
              "
              @click="emit('edit', participant)"
            />
          </template>
        </v-tooltip>

        <v-tooltip :text="t(translationKeys.actions.delete)" location="bottom">
          <template #activator="{ props: tooltipProps }">
            <v-icon-btn
              v-bind="tooltipProps"
              :icon="mdiDelete"
              variant="text"
              color="error"
              :aria-label="
                t(translationKeys.actions.ariaDelete, { name: participantLabel(participant) })
              "
              @click="emit('delete', participant)"
            />
          </template>
        </v-tooltip>
      </div>
    </div>

    <dl class="participant-entry__summary">
      <template v-for="header in summaryHeaders" :key="header.key">
        <dt>{{ header.title }}</dt>
        <dd v-if="header.key === 'grade'" class="participant-entry__grade-value">
          <JudoBeltSwatch
            v-if="participant.gradeBeltColorToken"
            :color-token="participant.gradeBeltColorToken"
          />
          {{ fieldValue(header.key) }}
        </dd>
        <dd v-else>{{ fieldValue(header.key) }}</dd>
      </template>
    </dl>

    <div class="participant-entry__details-toggle">
      <v-btn
        variant="text"
        block
        class="participant-entry__details-toggle-btn"
        :aria-expanded="detailsExpanded"
        :aria-controls="detailsPanelId()"
        @click="detailsExpanded = !detailsExpanded"
      >
        {{
          detailsExpanded
            ? t(translationKeys.entry.hideDetails)
            : t(translationKeys.entry.showDetails)
        }}
        <v-icon :icon="detailsExpanded ? mdiChevronUp : mdiChevronDown" end aria-hidden="true" />
      </v-btn>
    </div>

    <v-expand-transition>
      <dl v-if="detailsExpanded" :id="detailsPanelId()" class="participant-entry__details">
        <template v-for="header in secondaryHeaders" :key="header.key">
          <dt>{{ header.title }}</dt>
          <dd>{{ fieldValue(header.key) }}</dd>
        </template>
      </dl>
    </v-expand-transition>
  </v-card>
</template>

<style scoped>
.participant-entry {
  height: 100%;
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
}

.participant-entry__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.participant-entry__identity {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.participant-entry__avatar {
  flex-shrink: 0;
}

.participant-entry__avatar :deep(.v-avatar__underlay),
.participant-entry__avatar :deep(.v-avatar__content) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.participant-entry__name-block {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 0.125rem;
  min-width: 0;
}

.participant-entry__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
}

.participant-entry__club {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.participant-entry__actions {
  display: flex;
  flex-shrink: 0;
  gap: 0.25rem;
}

.participant-entry__summary,
.participant-entry__details {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 1.25rem;
  row-gap: 0.75rem;
  margin: 0;
  padding: 1.25rem;
}

.participant-entry__summary {
  padding-bottom: 1rem;
}

.participant-entry__summary dt,
.participant-entry__details dt {
  margin: 0;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.participant-entry__summary dd,
.participant-entry__details dd {
  margin: 0;
  text-align: left;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.participant-entry__grade-value {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.participant-entry__details-toggle {
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.participant-entry__details-toggle-btn.v-btn {
  justify-content: flex-start;
  height: auto;
  min-height: unset;
  padding: 1rem 1.25rem;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

.participant-entry__details {
  padding-top: 0;
}

.participant-entry__details dt,
.participant-entry__details dd {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.participant-entry__details dt {
  font-weight: 500;
}
</style>

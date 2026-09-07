<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  mdiCheckCircle,
  mdiChevronDown,
  mdiChevronUp,
  mdiCloseCircle,
  mdiDelete,
  mdiPencil
} from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { clubAvatarColor, clubHeaderBackground, clubInitials } from '../lib/club-avatar'
import { clubLabel } from '../lib/club-label'
import { resolveClubDetailFields } from '../lib/resolve-club-detail-fields'
import type { ClubFieldHeader, ClubOverviewItem } from '../model/use-club-overview'

const props = defineProps<{
  club: ClubOverviewItem
  fieldHeaders: ClubFieldHeader[]
}>()

const emit = defineEmits<{
  edit: [club: ClubOverviewItem]
  delete: [club: ClubOverviewItem]
}>()

const { t } = useTranslation()

const detailsExpanded = ref(false)
const avatarColor = computed(() => clubAvatarColor(props.club.name))
const headerBackground = computed(() => clubHeaderBackground(props.club.name))
const displayLabel = computed(() => clubLabel(props.club))
const emptyValue = computed(() => t(translationKeys.entry.emptyValue))
const detailFields = computed(() => resolveClubDetailFields(props.club))

const statusIcon = computed(() => (props.club.isActive ? mdiCheckCircle : mdiCloseCircle))
const statusColor = computed(() => (props.club.isActive ? 'success' : 'error'))

function headerTitle(key: string): string {
  return props.fieldHeaders.find((header) => header.key === key)?.title ?? key
}

function displayOrEmpty(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? ''

  return trimmed.length > 0 ? trimmed : emptyValue.value
}

function hierarchyLabel(name: string, shortName: string | null): string {
  if (!shortName?.trim()) {
    return displayOrEmpty(name)
  }

  return `${name} (${shortName.trim()})`
}

function detailsPanelId(): string {
  return `club-details-${props.club.id}`
}
</script>

<template>
  <v-card variant="outlined" class="club-entry" :aria-label="displayLabel">
    <div class="club-entry__header" :style="{ backgroundColor: headerBackground }">
      <div class="club-entry__identity">
        <v-avatar :color="avatarColor" size="40" class="club-entry__avatar">
          <span aria-hidden="true">{{ clubInitials(club.name) }}</span>
        </v-avatar>
        <div class="club-entry__name-block">
          <p class="club-entry__title">
            {{ club.name }}
          </p>
          <p v-if="club.shortName" class="club-entry__short-name">
            {{ club.shortName }}
          </p>
        </div>
      </div>

      <div class="club-entry__actions">
        <v-tooltip :text="club.statusLabel" location="bottom">
          <template #activator="{ props: tooltipProps }">
            <v-icon
              v-bind="tooltipProps"
              :icon="statusIcon"
              :color="statusColor"
              :aria-label="club.statusLabel"
              class="club-entry__status"
              role="img"
            />
          </template>
        </v-tooltip>

        <v-tooltip :text="t(translationKeys.actions.edit)" location="bottom">
          <template #activator="{ props: tooltipProps }">
            <v-icon-btn
              v-bind="tooltipProps"
              :icon="mdiPencil"
              variant="text"
              :aria-label="t(translationKeys.actions.ariaEdit, { name: displayLabel })"
              @click="emit('edit', club)"
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
              :aria-label="t(translationKeys.actions.ariaDelete, { name: displayLabel })"
              @click="emit('delete', club)"
            />
          </template>
        </v-tooltip>
      </div>
    </div>

    <dl class="club-entry__summary">
      <dt>{{ headerTitle('city') }}</dt>
      <dd>{{ displayOrEmpty(club.city) }}</dd>
      <dt>{{ headerTitle('website') }}</dt>
      <dd>{{ displayOrEmpty(club.website) }}</dd>
      <dt>{{ headerTitle('status') }}</dt>
      <dd>{{ club.statusLabel }}</dd>
      <dt>{{ headerTitle('district') }}</dt>
      <dd>{{ hierarchyLabel(club.districtName, club.districtShortName) }}</dd>
    </dl>

    <div class="club-entry__details-toggle">
      <v-btn
        variant="text"
        block
        class="club-entry__details-toggle-btn"
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
      <div v-if="detailsExpanded" :id="detailsPanelId()" class="club-entry__details-panel">
        <dl class="club-entry__details">
          <dt>{{ headerTitle('country') }}</dt>
          <dd>{{ displayOrEmpty(club.countryName) }}</dd>
          <dt>{{ headerTitle('association') }}</dt>
          <dd>{{ hierarchyLabel(club.associationName, club.associationShortName) }}</dd>
          <dt>{{ headerTitle('regionalAssociation') }}</dt>
          <dd>
            {{ hierarchyLabel(club.regionalAssociationName, club.regionalAssociationShortName) }}
          </dd>
          <dt>{{ headerTitle('district') }}</dt>
          <dd>{{ hierarchyLabel(club.districtName, club.districtShortName) }}</dd>

          <dt>{{ headerTitle('clubNumber') }}</dt>
          <dd>{{ displayOrEmpty(detailFields.clubNumber) }}</dd>

          <dt>{{ headerTitle('headquarters') }}</dt>
          <dd>{{ displayOrEmpty(detailFields.headquarters) }}</dd>
          <dt>{{ headerTitle('trainingVenue') }}</dt>
          <dd>{{ displayOrEmpty(detailFields.trainingVenue) }}</dd>
          <dt>{{ headerTitle('billingAddress') }}</dt>
          <dd>{{ displayOrEmpty(detailFields.billingAddress) }}</dd>

          <dt>{{ headerTitle('email') }}</dt>
          <dd>{{ displayOrEmpty(detailFields.email) }}</dd>
          <dt>{{ headerTitle('phone') }}</dt>
          <dd>{{ displayOrEmpty(detailFields.phone) }}</dd>
        </dl>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<style scoped>
.club-entry {
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
}

.club-entry__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.club-entry__identity {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.club-entry__avatar {
  flex-shrink: 0;
}

.club-entry__avatar :deep(.v-avatar__underlay),
.club-entry__avatar :deep(.v-avatar__content) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.club-entry__name-block {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 0.125rem;
  min-width: 0;
}

.club-entry__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
}

.club-entry__short-name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.club-entry__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.25rem;
}

.club-entry__status {
  margin-right: 0.25rem;
}

.club-entry__summary,
.club-entry__details {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 1.25rem;
  row-gap: 0.75rem;
  margin: 0;
  padding: 1.25rem;
}

.club-entry__summary {
  padding-bottom: 1rem;
}

.club-entry__summary dt,
.club-entry__details dt {
  margin: 0;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.club-entry__summary dd,
.club-entry__details dd {
  margin: 0;
  text-align: left;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  overflow-wrap: anywhere;
}

.club-entry__details-toggle {
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.club-entry__details-toggle-btn.v-btn {
  justify-content: flex-start;
  height: auto;
  min-height: unset;
  padding: 0.75rem 1.25rem;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

.club-entry__details-panel {
  overflow: hidden;
}

.club-entry__details {
  padding-top: 0;
  padding-bottom: 1rem;
}

.club-entry__details dt,
.club-entry__details dd {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.club-entry__details dt {
  font-weight: 500;
}
</style>

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
import {
  associationAvatarColor,
  associationHeaderBackground,
  associationInitials
} from '../lib/association-avatar'
import { associationLabel } from '../lib/association-label'
import { resolveAssociationDetailFields } from '../lib/resolve-association-detail-fields'
import { truncateAssociationTitle } from '../lib/truncate-association-title'
import type {
  AssociationFieldHeader,
  AssociationOverviewItem
} from '../model/use-association-overview'

const props = defineProps<{
  association: AssociationOverviewItem
  fieldHeaders: AssociationFieldHeader[]
}>()

const emit = defineEmits<{
  edit: [association: AssociationOverviewItem]
  delete: [association: AssociationOverviewItem]
}>()

const { t } = useTranslation()

const detailsExpanded = ref(false)
const avatarColor = computed(() => associationAvatarColor(props.association.name))
const headerBackground = computed(() => associationHeaderBackground(props.association.name))
const displayLabel = computed(() => associationLabel(props.association))
const truncatedTitle = computed(() => truncateAssociationTitle(props.association.name))
const isTitleTruncated = computed(() => truncatedTitle.value !== props.association.name)
const emptyValue = computed(() => t(translationKeys.entry.emptyValue))
const detailFields = computed(() => resolveAssociationDetailFields(props.association))
const websiteUrl = computed(() => websiteHref(props.association.website))
const emailUrl = computed(() => emailHref(detailFields.value.email))

const statusIcon = computed(() => (props.association.isActive ? mdiCheckCircle : mdiCloseCircle))
const statusColor = computed(() => (props.association.isActive ? 'success' : 'error'))

function headerTitle(key: string): string {
  return props.fieldHeaders.find((header) => header.key === key)?.title ?? key
}

function displayOrEmpty(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? ''

  return trimmed.length > 0 ? trimmed : emptyValue.value
}

function websiteHref(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return null
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}

function emailHref(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? ''

  return trimmed ? `mailto:${trimmed}` : null
}

function hierarchyLabel(name: string, shortName: string | null): string {
  if (!shortName?.trim()) {
    return displayOrEmpty(name)
  }

  return `${name} (${shortName.trim()})`
}

function detailsPanelId(): string {
  return `association-details-${props.association.id}`
}
</script>

<template>
  <v-card variant="outlined" class="association-entry" :aria-label="displayLabel">
    <div class="association-entry__header" :style="{ backgroundColor: headerBackground }">
      <div class="association-entry__identity">
        <v-avatar :color="avatarColor" size="40" class="association-entry__avatar">
          <span aria-hidden="true">{{ associationInitials(association.name) }}</span>
        </v-avatar>
        <div class="association-entry__name-block">
          <v-tooltip v-if="isTitleTruncated" :text="association.name" location="bottom">
            <template #activator="{ props: tooltipProps }">
              <p v-bind="tooltipProps" class="association-entry__title">
                {{ truncatedTitle }}
              </p>
            </template>
          </v-tooltip>
          <p v-else class="association-entry__title">
            {{ truncatedTitle }}
          </p>
          <p v-if="association.shortName" class="association-entry__short-name">
            {{ association.shortName }}
          </p>
        </div>
      </div>

      <div class="association-entry__actions">
        <v-tooltip :text="association.statusLabel" location="bottom">
          <template #activator="{ props: tooltipProps }">
            <v-icon
              v-bind="tooltipProps"
              :icon="statusIcon"
              :color="statusColor"
              :aria-label="association.statusLabel"
              class="association-entry__status"
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
              @click="emit('edit', association)"
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
              @click="emit('delete', association)"
            />
          </template>
        </v-tooltip>
      </div>
    </div>

    <dl class="association-entry__summary">
      <dt>{{ headerTitle('city') }}</dt>
      <dd>{{ displayOrEmpty(association.city) }}</dd>
      <dt>{{ headerTitle('associationNumber') }}</dt>
      <dd>{{ displayOrEmpty(detailFields.associationNumber) }}</dd>
    </dl>

    <div class="association-entry__details-toggle">
      <v-btn
        variant="text"
        block
        class="association-entry__details-toggle-btn"
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
      <div v-if="detailsExpanded" :id="detailsPanelId()" class="association-entry__details-panel">
        <dl class="association-entry__details">
          <dt>{{ headerTitle('country') }}</dt>
          <dd>{{ displayOrEmpty(association.countryName) }}</dd>
          <dt>{{ headerTitle('association') }}</dt>
          <dd>{{ hierarchyLabel(association.federationName, association.federationShortName) }}</dd>
          <dt>{{ headerTitle('regionalFederation') }}</dt>
          <dd>
            {{
              hierarchyLabel(
                association.regionalFederationName,
                association.regionalFederationShortName
              )
            }}
          </dd>

          <dt>{{ headerTitle('associationNumber') }}</dt>
          <dd>{{ displayOrEmpty(detailFields.associationNumber) }}</dd>

          <dt>{{ headerTitle('headquarters') }}</dt>
          <dd>{{ displayOrEmpty(detailFields.headquarters) }}</dd>
          <dt>{{ headerTitle('trainingVenue') }}</dt>
          <dd>{{ displayOrEmpty(detailFields.trainingVenue) }}</dd>
          <dt>{{ headerTitle('billingAddress') }}</dt>
          <dd>{{ displayOrEmpty(detailFields.billingAddress) }}</dd>

          <dt>{{ headerTitle('website') }}</dt>
          <dd>
            <a
              v-if="websiteUrl"
              class="association-entry__link"
              :href="websiteUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ displayOrEmpty(association.website) }}
            </a>
            <template v-else>{{ displayOrEmpty(association.website) }}</template>
          </dd>

          <dt>{{ headerTitle('email') }}</dt>
          <dd>
            <a
              v-if="emailUrl"
              class="association-entry__link"
              :href="emailUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ displayOrEmpty(detailFields.email) }}
            </a>
            <template v-else>{{ displayOrEmpty(detailFields.email) }}</template>
          </dd>
          <dt>{{ headerTitle('phone') }}</dt>
          <dd>{{ displayOrEmpty(detailFields.phone) }}</dd>
        </dl>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<style scoped>
.association-entry {
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
}

.association-entry__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.association-entry__identity {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.association-entry__avatar {
  flex-shrink: 0;
}

.association-entry__avatar :deep(.v-avatar__underlay),
.association-entry__avatar :deep(.v-avatar__content) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.association-entry__name-block {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 0.125rem;
  min-width: 0;
}

.association-entry__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
}

.association-entry__short-name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.association-entry__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.25rem;
}

.association-entry__status {
  margin-right: 0.25rem;
}

.association-entry__summary,
.association-entry__details {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 1.25rem;
  row-gap: 0.75rem;
  margin: 0;
  padding: 1.25rem;
}

.association-entry__summary {
  padding-bottom: 1rem;
}

.association-entry__summary dt,
.association-entry__details dt {
  margin: 0;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.association-entry__summary dd,
.association-entry__details dd {
  margin: 0;
  text-align: left;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  overflow-wrap: anywhere;
}

  .association-entry__link {
    color: rgb(var(--v-theme-primary));
    text-decoration: underline;
    text-underline-offset: 0.125rem;
  }

  .association-entry__link:hover {
    text-decoration-thickness: 0.125rem;
  }

.association-entry__details-toggle {
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.association-entry__details-toggle-btn.v-btn {
  justify-content: flex-start;
  height: auto;
  min-height: unset;
  padding: 0.75rem 1.25rem;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

.association-entry__details-panel {
  overflow: hidden;
}

.association-entry__details {
  padding-top: 0;
  padding-bottom: 1rem;
}

.association-entry__details dt,
.association-entry__details dd {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.association-entry__details dt {
  font-weight: 500;
}
</style>

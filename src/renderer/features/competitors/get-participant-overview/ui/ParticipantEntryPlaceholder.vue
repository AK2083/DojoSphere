<script setup lang="ts">
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'

const { t } = useTranslation()
</script>

<template>
  <v-card
    variant="outlined"
    class="participant-entry-placeholder"
    :aria-label="t(translationKeys.list.loadingPlaceholder)"
  >
    <div class="participant-entry-placeholder__header">
      <v-skeleton-loader type="avatar" class="participant-entry-placeholder__avatar" />
      <v-skeleton-loader type="heading" class="participant-entry-placeholder__title" />
    </div>

    <div class="participant-entry-placeholder__body">
      <v-skeleton-loader type="text@6" />
    </div>

    <v-skeleton-loader type="text" class="participant-entry-placeholder__toggle" />
  </v-card>
</template>

<style scoped>
.participant-entry-placeholder {
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
}

.participant-entry-placeholder__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.participant-entry-placeholder__avatar {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
}

.participant-entry-placeholder__avatar :deep(.v-skeleton-loader__avatar) {
  width: 2.5rem;
  height: 2.5rem;
}

.participant-entry-placeholder__title {
  flex: 1;
  min-width: 0;
}

.participant-entry-placeholder__body {
  padding: 1.25rem;
}

.participant-entry-placeholder__body :deep(.v-skeleton-loader__text) {
  margin-bottom: 0.5rem;
}

.participant-entry-placeholder__toggle {
  padding: 0 1.25rem 1.25rem;
}
</style>

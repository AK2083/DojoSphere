<script setup lang="ts">
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'

const { t } = useTranslation()
</script>

<template>
  <v-card
    variant="outlined"
    class="association-entry-placeholder"
    :aria-label="t(translationKeys.list.loadingPlaceholder)"
  >
    <div class="association-entry-placeholder__header">
      <v-skeleton-loader type="avatar" class="association-entry-placeholder__avatar" />
      <v-skeleton-loader type="heading" class="association-entry-placeholder__title" />
    </div>

    <div class="association-entry-placeholder__body">
      <v-skeleton-loader type="text@6" />
    </div>

    <v-skeleton-loader type="text" class="association-entry-placeholder__toggle" />
  </v-card>
</template>

<style scoped>
.association-entry-placeholder {
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
}

.association-entry-placeholder__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.association-entry-placeholder__avatar {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
}

.association-entry-placeholder__avatar :deep(.v-skeleton-loader__avatar) {
  width: 2.5rem;
  height: 2.5rem;
}

.association-entry-placeholder__title {
  flex: 1;
  min-width: 0;
}

.association-entry-placeholder__body {
  padding: 1.25rem;
}

.association-entry-placeholder__body :deep(.v-skeleton-loader__text) {
  margin-bottom: 0.5rem;
}

.association-entry-placeholder__toggle {
  padding: 0 1.25rem 1.25rem;
}
</style>

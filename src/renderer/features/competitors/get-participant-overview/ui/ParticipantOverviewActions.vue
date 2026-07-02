<script setup lang="ts">
import { computed } from 'vue'
import { mdiPlus, mdiTune } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'

defineProps<{
  addLabel: string
  isMobile: boolean
}>()

const emit = defineEmits<{
  add: []
}>()

const { t } = useTranslation()

const filterLabel = computed(() => t(translationKeys.toolbar.placeholderAction))
</script>

<template>
  <v-toolbar
    density="comfortable"
    flat
    class="participant-overview-actions"
    :aria-label="t(translationKeys.toolbar.ariaLabel)"
  >
    <div class="participant-overview-actions__inner">
      <div class="participant-overview-actions__start">
        <v-tooltip :text="addLabel" location="top">
          <template #activator="{ props: tooltipProps }">
            <v-icon-btn
              v-if="isMobile"
              v-bind="tooltipProps"
              :icon="mdiPlus"
              variant="text"
              :aria-label="addLabel"
              @click="emit('add')"
            />
            <v-btn
              v-else
              v-bind="tooltipProps"
              variant="text"
              rounded
              class="participant-overview-actions__add"
              @click="emit('add')"
            >
              <span class="participant-overview-actions__add-content">
                <v-icon :icon="mdiPlus" size="default" aria-hidden="true" />
                <span>{{ addLabel }}</span>
              </span>
            </v-btn>
          </template>
        </v-tooltip>
      </div>

      <v-spacer />

      <div class="participant-overview-actions__end">
        <v-tooltip :text="filterLabel" location="top">
          <template #activator="{ props: tooltipProps }">
            <v-icon-btn
              v-bind="tooltipProps"
              :icon="mdiTune"
              variant="text"
              :aria-label="filterLabel"
              class="participant-overview-actions__placeholder-action"
            />
          </template>
        </v-tooltip>
      </div>
    </div>
  </v-toolbar>
</template>

<style scoped>
.participant-overview-actions {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  overflow: hidden;
}

.participant-overview-actions :deep(.v-toolbar__content) {
  padding: 0;
}

.participant-overview-actions__inner {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.375rem 1.25rem;
}

.participant-overview-actions__start,
.participant-overview-actions__end {
  display: flex;
  align-items: center;
}

.participant-overview-actions__add {
  min-width: 0;
  padding: 0.75rem 1.25rem;
  letter-spacing: normal;
  text-transform: none;
}

.participant-overview-actions__add-content {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.participant-overview-actions__placeholder-action {
  pointer-events: none;
}
</style>

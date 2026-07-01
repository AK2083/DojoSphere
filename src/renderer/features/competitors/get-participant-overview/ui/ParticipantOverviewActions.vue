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
    <v-tooltip :text="addLabel" location="top">
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          rounded
          :icon="isMobile"
          :prepend-icon="isMobile ? undefined : mdiPlus"
          :aria-label="isMobile ? addLabel : undefined"
          @click="emit('add')"
        >
          <v-icon v-if="isMobile" :icon="mdiPlus" aria-hidden="true" />
          <span v-if="!isMobile">{{ addLabel }}</span>
        </v-btn>
      </template>
    </v-tooltip>
    <v-spacer />
    <v-tooltip :text="filterLabel" location="top">
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon
          :aria-label="filterLabel"
          class="participant-overview-actions__placeholder-action"
        >
          <v-icon :icon="mdiTune" aria-hidden="true" />
        </v-btn>
      </template>
    </v-tooltip>
  </v-toolbar>
</template>

<style scoped>
.participant-overview-actions {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  overflow: hidden;
}

.participant-overview-actions__placeholder-action {
  pointer-events: none;
}
</style>

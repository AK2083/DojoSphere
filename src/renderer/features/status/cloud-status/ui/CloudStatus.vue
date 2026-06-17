<script setup lang="ts">
import { mdiCloud, mdiCloudOff } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys.ts'
import { useCloudStatus } from '../model/use-cloud-status.ts'

const { isCloudUsed } = useCloudStatus()

const { t } = useTranslation()
</script>

<template>
  <v-tooltip v-if="isCloudUsed" :text="t(translationKeys.cloud)" location="top">
    <template #activator="{ props }">
      <v-chip
        v-bind="props"
        class="ma-1"
        label
        data-testid="cloud-status-chip"
        :aria-label="t(translationKeys.cloud)"
      >
        <v-icon :icon="mdiCloud"></v-icon>
      </v-chip>
    </template>
  </v-tooltip>
  <v-tooltip v-else :text="t(translationKeys.cloudless)" location="top">
    <template #activator="{ props }">
      <v-chip
        v-bind="props"
        class="ma-2"
        variant="outlined"
        label
        data-testid="cloud-status-chip"
        :aria-label="t(translationKeys.cloudless)"
      >
        <v-icon :icon="mdiCloudOff"></v-icon>
      </v-chip>
    </template>
  </v-tooltip>
</template>

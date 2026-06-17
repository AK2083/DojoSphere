<script setup lang="ts">
import { mdiWeb, mdiWebOff } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useNetworkStatus } from '../model/use-network-status'

const { isOnline } = useNetworkStatus()

const { t } = useTranslation()
</script>

<template>
  <v-tooltip v-if="isOnline" :text="t(translationKeys.online)" location="top">
    <template #activator="{ props }">
      <v-chip
        v-bind="props"
        class="ma-1"
        label
        data-testid="network-status-chip"
        :aria-label="t(translationKeys.online)"
      >
        <v-icon :icon="mdiWeb"></v-icon>
      </v-chip>
    </template>
  </v-tooltip>
  <v-tooltip v-else :text="t(translationKeys.offline)" location="top">
    <template #activator="{ props }">
      <v-chip
        v-bind="props"
        class="ma-2"
        variant="outlined"
        label
        data-testid="network-status-chip"
        :aria-label="t(translationKeys.offline)"
      >
        <v-icon :icon="mdiWebOff"></v-icon>
      </v-chip>
    </template>
  </v-tooltip>
</template>

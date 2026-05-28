<script setup lang="ts">
import { mdiWeb, mdiWebOff } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useNetworkStatus } from '../model/use-network-status'

const { isOnline } = useNetworkStatus()

const { t } = useTranslation()
</script>

<template>
  <v-chip v-if="isOnline" class="ma-1" label data-testid="network-status-chip">
    <v-icon :icon="mdiWeb" start></v-icon>
    {{ t(translationKeys.online) }}
  </v-chip>
  <v-chip v-else class="ma-2" variant="outlined" label data-testid="network-status-chip">
    <v-icon :icon="mdiWebOff" start></v-icon>
    {{ t(translationKeys.offline) }}
  </v-chip>
</template>

<script setup lang="ts">
import { mdiCloud, mdiCloudOff, mdiWeb, mdiWebOff } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useNetworkStatus } from '../model/use-network-status'

const { isOnline, isCloudUsed } = useNetworkStatus()

const { t } = useTranslation()
</script>

<template>
  <v-chip v-if="isCloudUsed" class="ma-1" label>
    <v-icon :icon="mdiCloud" start></v-icon>
    {{ t(translationKeys.cloud) }}
  </v-chip>
  <v-chip v-else class="ma-2" variant="outlined" label>
    <v-icon :icon="mdiCloudOff" start></v-icon>
    {{ t(translationKeys.cloudless) }}
  </v-chip>

  <v-chip v-if="isOnline" class="ma-1" label>
    <v-icon :icon="mdiWeb" start></v-icon>
    {{ t(translationKeys.online) }}
  </v-chip>
  <v-chip v-else class="ma-2" variant="outlined" label>
    <v-icon :icon="mdiWebOff" start></v-icon>
    {{ t(translationKeys.offline) }}
  </v-chip>
</template>

<script setup lang="ts">
import { mdiCloud, mdiCloudOff } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys.ts'
import { useCloudStatus } from '../model/use-cloud-status.ts'

const { isCloudUsed, toggleCloudUsed } = useCloudStatus()

const { t } = useTranslation()
</script>

<template>
  <v-chip
    v-if="isCloudUsed"
    class="ma-1"
    label
    data-testid="cloud-status-chip"
    @click="toggleCloudUsed"
  >
    <v-icon :icon="mdiCloud" start></v-icon>
    {{ t(translationKeys.cloud) }}
  </v-chip>
  <v-chip
    v-else
    class="ma-2"
    variant="outlined"
    label
    data-testid="cloud-status-chip"
    @click="toggleCloudUsed"
  >
    <v-icon :icon="mdiCloudOff" start></v-icon>
    {{ t(translationKeys.cloudless) }}
  </v-chip>
</template>

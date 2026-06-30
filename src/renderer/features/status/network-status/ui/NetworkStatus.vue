<script setup lang="ts">
import { mdiWeb, mdiWebOff } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useNetworkStatus } from '../model/use-network-status'

const { isOnline } = useNetworkStatus()

const { t } = useTranslation()
</script>

<template>
  <v-chip
    v-if="isOnline"
    class="ma-1"
    label
    role="status"
    data-testid="network-status-chip"
    :aria-label="t(translationKeys.online)"
  >
    <v-icon :icon="mdiWeb" aria-hidden="true" />
  </v-chip>
  <v-chip
    v-else
    class="ma-2"
    variant="outlined"
    label
    role="status"
    data-testid="network-status-chip"
    :aria-label="t(translationKeys.offline)"
  >
    <v-icon :icon="mdiWebOff" aria-hidden="true" />
  </v-chip>
</template>

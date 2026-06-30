<script setup lang="ts">
import { mdiCloud, mdiCloudOff } from '@mdi/js'
import { newStoreToRefs, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys.ts'
import { useCloudStatusStore } from '../store'

const cloudStatusStore = useCloudStatusStore()
const { isCloudUsed } = newStoreToRefs(cloudStatusStore)

const { t } = useTranslation()
</script>

<template>
  <v-chip
    v-if="isCloudUsed"
    class="ma-1"
    label
    role="status"
    data-testid="cloud-status-chip"
    :aria-label="t(translationKeys.cloud)"
  >
    <v-icon :icon="mdiCloud" aria-hidden="true" />
  </v-chip>
  <v-chip
    v-else
    class="ma-2"
    variant="outlined"
    label
    role="status"
    data-testid="cloud-status-chip"
    :aria-label="t(translationKeys.cloudless)"
  >
    <v-icon :icon="mdiCloudOff" aria-hidden="true" />
  </v-chip>
</template>

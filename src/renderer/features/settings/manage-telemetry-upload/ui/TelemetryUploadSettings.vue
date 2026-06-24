<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { mdiLicense } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'

const GRAFANA_PRIVACY_URL = 'https://grafana.com/legal/privacy-policy/'

defineProps<{
  autoUploadDiagnostics: boolean
}>()

const emit = defineEmits<{
  'update:autoUploadDiagnostics': [value: boolean]
}>()

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

function handleDiagnosticsChange(value: boolean | null) {
  if (value === null) {
    return
  }

  emit('update:autoUploadDiagnostics', value)
}
</script>

<template>
  <v-col v-if="!isMobile" cols="2" class="d-flex justify-center">
    <v-icon :icon="mdiLicense" size="64" aria-hidden="true" />
  </v-col>

  <v-col cols="12" md="10" class="d-flex flex-column ga-4">
    <div>
      <label class="font-weight-medium">{{ t(translationKeys.autoUpload.title) }}</label>
      <div class="text-medium-emphasis text-body-2">
        {{ t(translationKeys.autoUpload.description) }}
      </div>
      <div class="d-flex justify-end mt-2">
        <v-switch
          :model-value="autoUploadDiagnostics"
          :aria-label="
            t(
              autoUploadDiagnostics
                ? translationKeys.autoUpload.enabled
                : translationKeys.autoUpload.disabled
            )
          "
          color="primary"
          hide-details
          @update:model-value="handleDiagnosticsChange"
        />
      </div>
    </div>

    <v-expansion-panels variant="accordion">
      <v-expansion-panel>
        <v-expansion-panel-title>{{ t(translationKeys.legal.title) }}</v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="text-body-2">{{ t(translationKeys.legal.body) }}</p>
          <p class="text-body-2 mt-2">{{ t(translationKeys.legal.withdraw) }}</p>
          <a
            class="text-body-2"
            :href="GRAFANA_PRIVACY_URL"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t(translationKeys.legal.grafanaPrivacy) }}
          </a>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-col>
</template>

<script setup lang="ts">
import {
  CloudSettings,
  LanguageSwitch,
  syncTelemetryUploadPreferencesToMain,
  TelemetryUploadSettings,
  ThemeToggle,
  translationKeys,
  UsernameEditor,
  useTelemetryUploadStore
} from '@features/settings'
import { setCloudMode, useCloudStatusStore } from '@features/status'
import { newStoreToRefs, useTranslation } from '@shared/lib'

const { t } = useTranslation()
const cloudStatusStore = useCloudStatusStore()
const telemetryUploadStore = useTelemetryUploadStore()
const { isCloudUsed } = newStoreToRefs(cloudStatusStore)
const { autoUploadDiagnostics } = newStoreToRefs(telemetryUploadStore)

function handleCloudUpdate(value: boolean) {
  setCloudMode(value)
}

async function handleDiagnosticsUpdate(value: boolean) {
  telemetryUploadStore.setAutoUploadDiagnostics(value)
  await syncTelemetryUploadPreferencesToMain({ autoUploadDiagnostics: value })
}
</script>

<template>
  <v-container class="pa-6" max-width="900">
    <h2 class="text-h5 mb-6">{{ t(translationKeys.title) }}</h2>

    <v-sheet class="mb-4 border rounded pa-4">
      <v-row class="align-center">
        <UsernameEditor />
      </v-row>
    </v-sheet>

    <v-sheet class="mb-4 border rounded pa-4">
      <v-row class="align-center">
        <CloudSettings :is-cloud-used="isCloudUsed" @update:is-cloud-used="handleCloudUpdate" />
      </v-row>
    </v-sheet>

    <v-sheet class="mb-4 border rounded pa-4">
      <v-row class="align-center">
        <TelemetryUploadSettings
          :auto-upload-diagnostics="autoUploadDiagnostics"
          @update:auto-upload-diagnostics="handleDiagnosticsUpdate"
        />
      </v-row>
    </v-sheet>

    <v-sheet class="mb-4 border rounded pa-4">
      <v-row class="align-center">
        <LanguageSwitch />
      </v-row>
    </v-sheet>

    <v-sheet class="mb-4 border rounded pa-4">
      <v-row class="align-center">
        <ThemeToggle />
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import {
  DiagnosticsUploadSettings,
  LanguageSwitch,
  syncDiagnosticsUploadPreferencesToMain,
  ThemeToggle,
  translationKeys,
  useDiagnosticsUploadStore,
  UsernameEditor
} from '@features/settings'
import { newStoreToRefs, useTranslation } from '@shared/lib'

const { t } = useTranslation()
const diagnosticsUploadStore = useDiagnosticsUploadStore()
const { autoUploadDiagnostics } = newStoreToRefs(diagnosticsUploadStore)

async function handleDiagnosticsUpdate(value: boolean) {
  diagnosticsUploadStore.setAutoUploadDiagnostics(value)
  await syncDiagnosticsUploadPreferencesToMain({ autoUploadDiagnostics: value })
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
        <DiagnosticsUploadSettings
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

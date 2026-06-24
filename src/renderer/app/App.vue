<script setup lang="ts">
import { onMounted } from 'vue'
import { syncTelemetryUploadPreferencesToMain, useTelemetryUploadStore } from '@features/settings'
import { bootstrapNetworkStatus } from '@features/status'
import { setAutoUploadDiagnosticsCheck } from '@shared/lib'
import { BottomNavigation, Navigation } from '@widgets/navigation'

setAutoUploadDiagnosticsCheck(() => useTelemetryUploadStore().autoUploadDiagnostics)

void bootstrapNetworkStatus()

onMounted(() => {
  void syncTelemetryUploadPreferencesToMain({
    autoUploadDiagnostics: useTelemetryUploadStore().autoUploadDiagnostics
  })
})
</script>

<template>
  <v-app>
    <v-layout class="h-screen">
      <Navigation />
      <v-main class="app-main"><router-view /></v-main>
      <BottomNavigation />
    </v-layout>
  </v-app>
</template>

<style scoped>
.app-main {
  min-height: 0;
  overflow-y: auto;
}
</style>

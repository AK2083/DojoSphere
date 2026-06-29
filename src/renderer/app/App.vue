<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import {
  syncDiagnosticsUploadPreferencesToMain,
  useDiagnosticsUploadStore
} from '@features/settings'
import { bootstrapCloudStatusFromAuth, bootstrapNetworkStatus } from '@features/status'
import { BottomNavigation, Navigation } from '@widgets/navigation'

void bootstrapNetworkStatus()

let unsubscribeCloudStatus: (() => void) | undefined

onMounted(() => {
  unsubscribeCloudStatus = bootstrapCloudStatusFromAuth()

  void syncDiagnosticsUploadPreferencesToMain({
    autoUploadDiagnostics: useDiagnosticsUploadStore().autoUploadDiagnostics
  })
})

onUnmounted(() => {
  unsubscribeCloudStatus?.()
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

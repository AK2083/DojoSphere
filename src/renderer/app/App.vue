<script setup lang="ts">
import { bootstrapNetworkStatus, useCloudStatusStore } from '@features/status'
import { setCloudModeMonitoringCheck } from '@shared/lib'
import { BottomNavigation, Navigation } from '@widgets/navigation'

setCloudModeMonitoringCheck(() => useCloudStatusStore().isCloudUsed)
void bootstrapNetworkStatus()
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

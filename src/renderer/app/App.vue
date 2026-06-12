<script setup lang="ts">
import { bootstrapNetworkStatus } from '@shared/model'
import { BottomNavigation, Navigation } from '@widgets/navigation'

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

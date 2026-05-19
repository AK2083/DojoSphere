<script setup lang="ts">
import { BottomNavigation, Navigation } from '@widgets/navigation'
</script>

<template>
  <v-app>
    <v-layout class="h-screen">
      <Navigation />
      <v-main><router-view /></v-main>
      <BottomNavigation />
    </v-layout>
  </v-app>
</template>

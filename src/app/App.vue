<script setup lang="ts">
import { Navigation } from '@widgets/navigation'
</script>

<template>
  <v-app>
    <v-layout>
      <Navigation />
      <v-main><router-view /></v-main>
    </v-layout>
  </v-app>
</template>

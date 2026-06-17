<script setup lang="ts">
import { CloudStatus, NetworkStatus } from '@features/status'
</script>

<template>
  <v-footer app height="40">
    <v-spacer />

    <CloudStatus />
    <NetworkStatus />
  </v-footer>
</template>

<script setup lang="ts">
import { NetworkStatus } from '@features/network-status'
</script>

<template>
  <v-footer app height="40">
    <v-spacer />

    <NetworkStatus />
  </v-footer>
</template>

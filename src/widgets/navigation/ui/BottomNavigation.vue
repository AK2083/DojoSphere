<script setup lang="ts">
import { CloudStatus } from '@features/cloud-status'
import { NetworkStatus } from '@features/network-status'
</script>

<template>
  <v-footer app height="40">
    <v-spacer />

    <CloudStatus />
    <NetworkStatus />
  </v-footer>
</template>

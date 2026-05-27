<script setup lang="ts">
import { RegisterForm } from '@features/authentication/register-user'
import { LocalWork } from '@features/authentication/work-local'
</script>

<template>
  <v-container class="h-100 d-flex align-start align-md-center justify-start overflow-y-auto py-4">
    <v-row class="w-100">
      <v-col cols="12" md="6"><RegisterForm /></v-col>
      <v-col cols="12" md="6"><LocalWork /></v-col>
    </v-row>
  </v-container>
</template>

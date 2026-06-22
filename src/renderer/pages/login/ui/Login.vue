<script setup lang="ts">
import { LoginForm } from '@features/authentication/signin-user'
</script>

<template>
  <v-container class="h-100 d-flex align-start align-md-center justify-center overflow-y-auto py-4">
    <v-row class="w-100" justify="center">
      <v-col cols="12" lg="8">
        <LoginForm />
      </v-col>
    </v-row>
  </v-container>
</template>

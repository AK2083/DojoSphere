<script setup lang="ts">
import { LoginForm } from '@features/authentication'
</script>
<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="w-100" justify="center">
      <v-col cols="12" sm="10" lg="8">
        <LoginForm />
      </v-col>
    </v-row>
  </v-container>
</template>

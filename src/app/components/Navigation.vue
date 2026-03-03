<script setup>
import { ref } from 'vue'

const drawer = ref(true)
const rail = ref(true)
</script>

<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent>
    <template #append>
      <div class="pa-2">
        <v-btn block icon="mdi-cog" variant="text" density="comfortable" />
      </div>
    </template>
  </v-navigation-drawer>
</template>

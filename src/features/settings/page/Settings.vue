<script setup>
import { ref } from 'vue'

const toggle = ref(null)
</script>

<template>
  <v-container>
    <h2 class="text-h5 mb-6">Einstellungen</h2>

    <v-row class="align-center mb-4 border rounded pa-4">
      <v-col cols="12" md="8" class="d-flex flex-column justify-center">
        <label class="font-weight-medium">Wähle eine Sprache aus</label>
        <div class="text-medium-emphasis text-body-2">
          Diese Sprache wird in der gesamten Anwendung verwendet
        </div>
      </v-col>

      <v-col cols="12" md="4" class="d-flex align-center">
        <v-select
          label="Sprachauswahl"
          :items="['Englisch', 'Deutsch']"
          density="comfortable"
          hide-details
          class="w-100"
        ></v-select>
      </v-col>
    </v-row>

    <v-row class="align-center mb-4 border rounded pa-4">
      <v-col cols="12" md="8">
        <label class="font-weight-medium">Theme</label>
        <div class="text-medium-emphasis text-body-2">
          Diese Sprache wird in der gesamten Anwendung verwendet
        </div>
      </v-col>

      <v-col cols="12" md="4" class="d-flex justify-end">
        <v-btn-toggle v-model="toggle" class="align-right border" divided>
          <v-btn icon="mdi-laptop"></v-btn>
          <v-btn icon="mdi-moon-waning-crescent"></v-btn>
          <v-btn icon="mdi-white-balance-sunny"></v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
  </v-container>
</template>

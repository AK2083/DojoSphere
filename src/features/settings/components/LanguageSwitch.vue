<template>
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
</template>

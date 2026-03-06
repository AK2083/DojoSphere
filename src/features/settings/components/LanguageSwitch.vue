<script setup>
import languageImage from '@features/settings/assets/Language.webp'
</script>
<template>
  <v-col cols="2" class="d-flex justify-center">
    <v-img
      :src="languageImage"
      width="120"
      height="120"
      rounded="xl"
      alt="Rei-Language"
    />
  </v-col>

  <v-col cols="10" class="d-flex flex-column">
    <div>
      <label class="font-weight-medium">Wähle eine Sprache aus</label>
      <div class="text-medium-emphasis text-body-2">
        Diese Sprache wird in der gesamten Anwendung verwendet
      </div>
    </div>

    <v-select
      class="mt-2"
      label="Sprachauswahl"
      :items="['Englisch', 'Deutsch']"
      density="comfortable"
      hide-details
    />
  </v-col>
</template>

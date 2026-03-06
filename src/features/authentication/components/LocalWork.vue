<script setup>
import localImage from '@features/authentication/assets/Local.webp'
</script>

<template>
  <v-card
    title="Lokales Arbeiten"
    subtitle="Hier kann lokal weitergearbeitet werden."
    class="border px-4 py-4"
  >
    <template #prepend>
      <v-img
        :src="localImage"
        width="64"
        height="64"
        rounded="shaped"
        cover
        class="border"
      />
    </template>

    <template #text>
      <span
        >Hier kann lokal weitergearbeitet werden. Alle Daten werden lokal
        gespeichert und nicht mit dem Server synchronisiert.</span
      >
    </template>

    <template #actions>
      <v-btn text="Lokal weitermachen" variant="tonal" block></v-btn>
    </template>
  </v-card>
</template>

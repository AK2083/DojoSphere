<template>
  <v-container class="pa-6" max-width="900">
    <h2 class="text-h5 mb-6">Einstellungen</h2>

    <v-sheet class="mb-4 border rounded pa-4">
      <v-row class="align-center">
        <LanguageSwitch />
      </v-row>
    </v-sheet>

    <v-sheet class="mb-4 border rounded pa-4">
      <v-row class="align-center">
        <ThemeToggle />
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const drawer = ref(false)
const { smAndDown } = useDisplay()
const isMobile = computed(() => {
  drawer.value = !smAndDown.value
  return smAndDown.value
})
</script>

<template>
  <v-app-bar v-if="isMobile" density="compact">
    <template #append>
      <v-btn icon aria-label="Account" to="/"
        ><v-icon>mdi-account</v-icon></v-btn
      >
      <v-btn icon aria-label="Settings" to="/settings"
        ><v-icon>mdi-cog</v-icon></v-btn
      >
    </template>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    density="comfortable"
    rail
    floating
    :temporary="isMobile"
    :permanent="!isMobile"
  >
    <template #append>
      <v-list nav density="compact">
        <v-list-item prepend-icon="mdi-account" to="/" title="Account" />

        <v-list-item prepend-icon="mdi-cog" to="/settings" title="Settings" />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

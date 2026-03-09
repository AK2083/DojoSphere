<script setup>
import { useDisplay } from 'vuetify'
import { mdiAccount, mdiCog } from '@mdi/js'

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
      <v-btn icon aria-label="Account" :to="{ name: 'home' }" exact
        ><v-icon :icon="mdiAccount"></v-icon
      ></v-btn>
      <v-btn icon aria-label="Settings" :to="{ name: 'settings' }"
        ><v-icon :icon="mdiCog"></v-icon
      ></v-btn>
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
        <v-list-item
          :prepend-icon="mdiAccount"
          :to="{ name: 'home' }"
          title="Account"
          exact
        />
        <v-list-item
          :prepend-icon="mdiCog"
          :to="{ name: 'settings' }"
          title="Settings"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

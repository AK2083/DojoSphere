<script setup>
const drawer = ref(true)
const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)
</script>

<template>
  <v-app-bar v-if="isMobile" density="compact">
    <template #append>
      <v-btn icon="mdi-cog"></v-btn>
    </template>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    rail
    floating
    :temporary="isMobile"
    :permanent="!isMobile"
  >
    <template #append>
      <div class="pa-2">
        <v-btn
          block
          icon="mdi-cog"
          variant="text"
          density="comfortable"
          @click="isMobile && (drawer = false)"
        />
      </div>
    </template>
  </v-navigation-drawer>
</template>

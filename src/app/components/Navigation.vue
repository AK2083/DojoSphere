<script setup>
const drawer = ref(true)
const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)
</script>

<template>
  <v-btn
    v-if="isMobile"
    density="default"
    icon="mdi-menu"
    class="ma-2"
    @click="drawer = !drawer"
  ></v-btn>

  <v-navigation-drawer
    v-model="drawer"
    rail
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

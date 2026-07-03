<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  title: string
  subtitle: string
  icon: string
}>()

const titleId = useId()
</script>

<template>
  <v-card
    class="import-step-section"
    variant="outlined"
    :prepend-icon="icon"
    :subtitle="subtitle"
    :aria-labelledby="titleId"
  >
    <template #title>
      <span :id="titleId" class="font-weight-medium">{{ title }}</span>
    </template>

    <v-card-text class="bg-surface-light pt-4">
      <slot />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.import-step-section {
  border-color: rgba(var(--v-theme-on-surface), 0.38);
}
</style>

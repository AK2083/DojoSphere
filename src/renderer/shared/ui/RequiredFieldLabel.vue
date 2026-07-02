<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <span class="required-field-label">
    {{ text }}
    <span class="required-field-label__asterisk" aria-hidden="true">*</span>
  </span>
</template>

<style scoped>
.required-field-label__asterisk {
  color: rgb(var(--v-theme-error));
  margin-inline-start: 0.125rem;
}
</style>

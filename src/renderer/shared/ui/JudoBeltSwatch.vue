<script setup lang="ts">
import { computed } from 'vue'
import { judoBeltSwatchStyle } from '@shared/lib/judo-belt/judo-belt-color'

const props = withDefaults(
  defineProps<{
    colorToken?: string | null
    size?: 'sm' | 'md'
  }>(),
  {
    colorToken: null,
    size: 'sm'
  }
)

const beltStyle = computed(() => judoBeltSwatchStyle(props.colorToken))
</script>

<template>
  <span
    class="judo-belt-swatch"
    :class="`judo-belt-swatch--${size}`"
    :style="beltStyle"
    aria-hidden="true"
  />
</template>

<style scoped>
.judo-belt-swatch {
  display: inline-block;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.judo-belt-swatch--sm {
  width: 1.75rem;
  height: 0.5rem;
}

.judo-belt-swatch--md {
  width: 2.25rem;
  height: 0.625rem;
}
</style>

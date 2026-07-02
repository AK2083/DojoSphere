<script setup lang="ts">
import { computed } from 'vue'
import { resolveJudoBeltAvatarFill } from '@shared/lib/judo-belt/judo-belt-color'

const props = withDefaults(
  defineProps<{
    colorToken?: string | null
    size?: number
  }>(),
  {
    colorToken: null,
    size: 40
  }
)

const fill = computed(() => resolveJudoBeltAvatarFill(props.colorToken))
const hasBelt = computed(() => fill.value.kind !== 'empty')
</script>

<template>
  <v-avatar
    :size="size"
    class="judo-belt-avatar"
    :class="{ 'judo-belt-avatar--empty': !hasBelt }"
    variant="flat"
    aria-hidden="true"
  >
    <div
      v-if="fill.kind === 'solid'"
      class="judo-belt-avatar__fill"
      :style="{ backgroundColor: fill.color }"
    />
    <div
      v-else-if="fill.kind === 'banded'"
      class="judo-belt-avatar__fill judo-belt-avatar__fill--banded"
    >
      <span class="judo-belt-avatar__band" :style="{ backgroundColor: fill.outerColor }" />
      <span
        class="judo-belt-avatar__band judo-belt-avatar__band--center"
        :style="{ backgroundColor: fill.centerColor }"
      />
      <span class="judo-belt-avatar__band" :style="{ backgroundColor: fill.outerColor }" />
    </div>
    <div
      v-else-if="fill.kind === 'striped'"
      class="judo-belt-avatar__fill"
      :style="{ background: fill.background }"
    />
  </v-avatar>
</template>

<style scoped>
.judo-belt-avatar {
  position: relative;
  flex-shrink: 0;
}

.judo-belt-avatar::after {
  position: absolute;
  inset: 0;
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: inherit;
  content: '';
  pointer-events: none;
}

.judo-belt-avatar--empty {
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.judo-belt-avatar :deep(.v-avatar__underlay) {
  opacity: 0;
}

.judo-belt-avatar :deep(.v-avatar__content) {
  display: block;
  align-items: stretch;
  justify-content: stretch;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: hidden;
}

.judo-belt-avatar__fill {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.judo-belt-avatar__fill--banded {
  display: flex;
  flex-direction: column;
}

.judo-belt-avatar__fill--banded .judo-belt-avatar__band {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
}

.judo-belt-avatar__fill--banded .judo-belt-avatar__band--center {
  flex-grow: 3;
}
</style>

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
    <div v-else-if="fill.kind === 'banded'" class="judo-belt-avatar__fill">
      <span
        class="judo-belt-avatar__band judo-belt-avatar__band--top"
        :style="{ backgroundColor: fill.outerColor }"
      />
      <span
        class="judo-belt-avatar__band judo-belt-avatar__band--center"
        :style="{ backgroundColor: fill.centerColor }"
      />
      <span
        class="judo-belt-avatar__band judo-belt-avatar__band--bottom"
        :style="{ backgroundColor: fill.outerColor }"
      />
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
  flex-shrink: 0;
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.judo-belt-avatar--empty {
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.judo-belt-avatar :deep(.v-avatar__underlay) {
  opacity: 0;
}

.judo-belt-avatar :deep(.v-avatar__content) {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: hidden;
}

.judo-belt-avatar__fill {
  position: relative;
  width: 100%;
  height: 100%;
}

.judo-belt-avatar__band {
  position: absolute;
  left: 0;
  width: 100%;
}

.judo-belt-avatar__band--top {
  top: 0;
  height: 30%;
}

.judo-belt-avatar__band--center {
  top: 30%;
  height: 40%;
}

.judo-belt-avatar__band--bottom {
  bottom: 0;
  height: 30%;
}
</style>

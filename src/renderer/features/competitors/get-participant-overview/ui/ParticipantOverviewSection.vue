<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useParticipantOverview } from '../model/use-participant-overview'
import ParticipantOverviewMobile from './ParticipantOverviewMobile.vue'
import ParticipantOverviewTable from './ParticipantOverviewTable.vue'

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const { loading, tableItems, headers, sortBy, handleAdd, handleEdit, handleDelete } =
  useParticipantOverview()

const isMobile = computed(() => smAndDown.value)
</script>

<template>
  <section
    class="participant-list-section"
    :class="{ 'participant-list-section--mobile': isMobile }"
    role="region"
    :aria-label="t(translationKeys.table.ariaLabel)"
  >
    <ParticipantOverviewMobile
      v-if="isMobile"
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="tableItems"
      :loading="loading"
      @add="handleAdd"
      @delete="handleDelete"
      @edit="handleEdit"
    />
    <ParticipantOverviewTable
      v-else
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="tableItems"
      :loading="loading"
      @add="handleAdd"
      @delete="handleDelete"
      @edit="handleEdit"
    />
  </section>
</template>

<style scoped>
.participant-list-section {
  width: 100%;
}

.participant-list-section--mobile {
  background-color: rgb(var(--v-theme-background));
  border-radius: 4px;
}
</style>

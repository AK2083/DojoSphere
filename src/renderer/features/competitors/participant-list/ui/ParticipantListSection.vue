<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useParticipantList } from '../model/use-participant-list'
import ParticipantListMobile from './ParticipantListMobile.vue'
import ParticipantListTable from './ParticipantListTable.vue'

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const { loading, tableItems, headers, sortBy, handleAdd, handleEdit, handleDelete } =
  useParticipantList()

const isMobile = computed(() => smAndDown.value)
</script>

<template>
  <section
    class="participant-list-section"
    :class="{ 'participant-list-section--mobile': isMobile }"
    role="region"
    :aria-label="t(translationKeys.table.ariaLabel)"
  >
    <ParticipantListMobile
      v-if="isMobile"
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="tableItems"
      :loading="loading"
      @add="handleAdd"
      @delete="handleDelete"
      @edit="handleEdit"
    />
    <ParticipantListTable
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

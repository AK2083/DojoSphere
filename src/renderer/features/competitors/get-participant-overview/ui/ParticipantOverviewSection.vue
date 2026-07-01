<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useParticipantOverview } from '../model/use-participant-overview'
import ParticipantEntry from './ParticipantEntry.vue'
import ParticipantEntryPlaceholder from './ParticipantEntryPlaceholder.vue'
import ParticipantOverviewActions from './ParticipantOverviewActions.vue'

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const {
  loading,
  loadErrorMessage,
  overviewItems,
  fieldHeaders,
  handleAdd,
  handleEdit,
  handleDelete
} = useParticipantOverview()

const isMobile = computed(() => smAndDown.value)
const addLabel = computed(() => t(translationKeys.actions.add))
const placeholderCount = computed(() => (isMobile.value ? 2 : 3))

const gridClassNames = computed(() => ({
  'participant-overview-section__grid--single': !loading.value && overviewItems.value.length === 1,
  'participant-overview-section__grid--mobile': isMobile.value
}))
</script>

<template>
  <section
    class="participant-overview-section"
    role="region"
    :aria-label="t(translationKeys.list.ariaLabel)"
    :aria-busy="loading"
  >
    <v-alert
      v-if="loadErrorMessage"
      type="error"
      variant="tonal"
      density="comfortable"
      class="mb-4"
      role="alert"
    >
      {{ loadErrorMessage }}
    </v-alert>

    <ParticipantOverviewActions
      class="mb-4"
      :add-label="addLabel"
      :is-mobile="isMobile"
      @add="handleAdd"
    />

    <div v-if="loading" class="participant-overview-section__grid" :class="gridClassNames">
      <ParticipantEntryPlaceholder
        v-for="index in placeholderCount"
        :key="`participant-placeholder-${index}`"
      />
    </div>

    <p
      v-else-if="overviewItems.length === 0"
      class="participant-overview-section__empty text-medium-emphasis"
    >
      {{ t(translationKeys.list.empty) }}
    </p>

    <div v-else class="participant-overview-section__grid" :class="gridClassNames">
      <ParticipantEntry
        v-for="participant in overviewItems"
        :key="participant.id"
        :participant="participant"
        :field-headers="fieldHeaders"
        @delete="handleDelete"
        @edit="handleEdit"
      />
    </div>
  </section>
</template>

<style scoped>
.participant-overview-section {
  width: 100%;
}

.participant-overview-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
  gap: 1rem;
  width: 100%;
}

.participant-overview-section__grid--mobile {
  grid-template-columns: 1fr;
}

.participant-overview-section__grid--single:not(.participant-overview-section__grid--mobile) {
  max-width: 28rem;
}

.participant-overview-section__empty {
  margin: 0;
  padding: 2rem 0;
  text-align: center;
}
</style>

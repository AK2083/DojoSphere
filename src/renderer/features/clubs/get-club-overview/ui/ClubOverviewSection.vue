<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useClubOverview } from '../model/use-club-overview'
import ClubEntry from './ClubEntry.vue'
import ClubEntryPlaceholder from './ClubEntryPlaceholder.vue'
import ClubOverviewActions from './ClubOverviewActions.vue'

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const {
  loading,
  loadErrorMessage,
  stubMessage,
  overviewItems,
  fieldHeaders,
  handleAdd,
  handleEdit,
  handleDelete,
  clearStubMessage
} = useClubOverview()

const isMobile = computed(() => smAndDown.value)
const addLabel = computed(() => t(translationKeys.actions.add))
const placeholderCount = computed(() => (isMobile.value ? 2 : 3))
const showStubSnackbar = computed({
  get: () => stubMessage.value.length > 0,
  set: (value: boolean) => {
    if (!value) {
      clearStubMessage()
    }
  }
})

const gridClassNames = computed(() => ({
  'club-overview-section__grid--single': !loading.value && overviewItems.value.length === 1,
  'club-overview-section__grid--mobile': isMobile.value
}))
</script>

<template>
  <section
    class="club-overview-section"
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

    <ClubOverviewActions
      class="mb-4"
      :add-label="addLabel"
      :is-mobile="isMobile"
      @add="handleAdd"
    />

    <div v-if="loading" class="club-overview-section__grid" :class="gridClassNames">
      <ClubEntryPlaceholder v-for="index in placeholderCount" :key="`club-placeholder-${index}`" />
    </div>

    <p
      v-else-if="overviewItems.length === 0"
      class="club-overview-section__empty text-medium-emphasis"
    >
      {{ t(translationKeys.list.empty) }}
    </p>

    <div v-else class="club-overview-section__grid" :class="gridClassNames">
      <ClubEntry
        v-for="club in overviewItems"
        :key="club.id"
        :club="club"
        :field-headers="fieldHeaders"
        @delete="handleDelete"
        @edit="handleEdit"
      />
    </div>

    <v-snackbar v-model="showStubSnackbar" color="info" location="top" timeout="4000">
      {{ stubMessage }}
      <template #actions>
        <v-btn variant="text" @click="clearStubMessage">OK</v-btn>
      </template>
    </v-snackbar>
  </section>
</template>

<style scoped>
.club-overview-section {
  width: 100%;
}

.club-overview-section__grid {
  display: grid;
  align-items: start;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
  gap: 1rem;
  width: 100%;
}

.club-overview-section__grid--mobile {
  grid-template-columns: 1fr;
}

.club-overview-section__grid--single:not(.club-overview-section__grid--mobile) {
  max-width: 28rem;
}

.club-overview-section__empty {
  margin: 0;
  padding: 2rem 0;
  text-align: center;
}
</style>

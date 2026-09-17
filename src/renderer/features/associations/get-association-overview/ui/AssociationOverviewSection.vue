<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useTranslation } from '@shared/lib'

import { SyncAssociationsDialog, useSyncAssociations } from '../../sync-associations'
import translationKeys from '../i18n/keys'
import { useAssociationOverview } from '../model/use-association-overview'
import AssociationEntry from './AssociationEntry.vue'
import AssociationEntryPlaceholder from './AssociationEntryPlaceholder.vue'
import AssociationOverviewActions from './AssociationOverviewActions.vue'

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const {
  loading,
  loadErrorMessage,
  overviewItems,
  fieldHeaders,
  refresh,
  handleAdd,
  handleEdit,
  handleDelete
} = useAssociationOverview()

const syncDialog = useSyncAssociations()

const isMobile = computed(() => smAndDown.value)
const addLabel = computed(() => t(translationKeys.actions.add))
const placeholderCount = computed(() => (isMobile.value ? 2 : 3))

const gridClassNames = computed(() => ({
  'association-overview-section__grid--single': !loading.value && overviewItems.value.length === 1,
  'association-overview-section__grid--mobile': isMobile.value
}))
</script>

<template>
  <section
    class="association-overview-section"
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

    <AssociationOverviewActions
      class="mb-4"
      :add-label="addLabel"
      :is-mobile="isMobile"
      @add="handleAdd"
      @sync="syncDialog.open()"
    />

    <SyncAssociationsDialog
      v-model="syncDialog.isOpen.value"
      :phase="syncDialog.phase.value"
      :progress="syncDialog.progress.value"
      :error-message="syncDialog.errorMessage.value"
      :is-not-signed-in="syncDialog.isNotSignedIn.value"
      :synced-count="syncDialog.syncedCount.value"
      @confirm="syncDialog.confirm()"
      @close="syncDialog.close()"
      @done="refresh()"
    />

    <div v-if="loading" class="association-overview-section__grid" :class="gridClassNames">
      <AssociationEntryPlaceholder
        v-for="index in placeholderCount"
        :key="`association-placeholder-${index}`"
      />
    </div>

    <p
      v-else-if="overviewItems.length === 0"
      class="association-overview-section__empty text-medium-emphasis"
    >
      {{ t(translationKeys.list.empty) }}
    </p>

    <div v-else class="association-overview-section__grid" :class="gridClassNames">
      <AssociationEntry
        v-for="association in overviewItems"
        :key="association.id"
        :association="association"
        :field-headers="fieldHeaders"
        @delete="handleDelete"
        @edit="handleEdit"
      />
    </div>
  </section>
</template>

<style scoped>
.association-overview-section {
  width: 100%;
}

.association-overview-section__grid {
  display: grid;
  align-items: start;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
  gap: 1rem;
  width: 100%;
}

.association-overview-section__grid--mobile {
  grid-template-columns: 1fr;
}

.association-overview-section__grid--single:not(.association-overview-section__grid--mobile) {
  max-width: 28rem;
}

.association-overview-section__empty {
  margin: 0;
  padding: 2rem 0;
  text-align: center;
}
</style>

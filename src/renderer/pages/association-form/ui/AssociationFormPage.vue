<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { AssociationForm, saveAssociationTranslationKeys } from '@features/associations'
import { mdiArrowLeft } from '@mdi/js'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
const route = useRoute()

const isCreateMode = computed(() => route.name === 'association-create')

const associationId = computed(() =>
  route.name === 'association-edit' ? String(route.params.id) : undefined
)

const pageTitle = computed(() =>
  t(
    isCreateMode.value
      ? saveAssociationTranslationKeys.page.titleCreate
      : saveAssociationTranslationKeys.page.titleEdit
  )
)
</script>

<template>
  <v-container class="pa-6" max-width="800">
    <div class="mb-4">
      <v-btn
        :to="{ name: 'associations' }"
        variant="text"
        class="align-self-start"
        :prepend-icon="mdiArrowLeft"
        :aria-label="t(saveAssociationTranslationKeys.actions.back)"
      >
        {{ t(saveAssociationTranslationKeys.actions.back) }}
      </v-btn>
    </div>
    <AssociationForm :association-id="associationId" :title="pageTitle" />
  </v-container>
</template>

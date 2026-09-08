<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ClubForm, saveClubTranslationKeys } from '@features/clubs'
import { mdiArrowLeft } from '@mdi/js'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
const route = useRoute()

const isCreateMode = computed(() => route.name === 'club-create')

const clubId = computed(() => (route.name === 'club-edit' ? String(route.params.id) : undefined))

const pageTitle = computed(() =>
  t(
    isCreateMode.value
      ? saveClubTranslationKeys.page.titleCreate
      : saveClubTranslationKeys.page.titleEdit
  )
)
</script>

<template>
  <v-container class="pa-6" max-width="800">
    <div class="mb-4">
      <v-btn
        :to="{ name: 'clubs' }"
        variant="text"
        class="align-self-start"
        :prepend-icon="mdiArrowLeft"
        :aria-label="t(saveClubTranslationKeys.actions.back)"
      >
        {{ t(saveClubTranslationKeys.actions.back) }}
      </v-btn>
    </div>
    <ClubForm :club-id="clubId" :title="pageTitle" />
  </v-container>
</template>

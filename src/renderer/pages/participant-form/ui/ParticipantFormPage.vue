<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ParticipantForm, saveParticipantTranslationKeys } from '@features/competitors'
import { mdiArrowLeft } from '@mdi/js'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
const route = useRoute()

const isCreateMode = computed(() => route.name === 'participant-create')

const participantId = computed(() =>
  route.name === 'participant-edit' ? String(route.params.id) : undefined
)

const pageTitle = computed(() =>
  t(
    isCreateMode.value
      ? saveParticipantTranslationKeys.page.titleCreate
      : saveParticipantTranslationKeys.page.titleEdit
  )
)
</script>

<template>
  <v-container class="pa-6" max-width="800">
    <div class="d-flex flex-column ga-4 mb-6">
      <v-btn
        :to="{ name: 'participants' }"
        variant="text"
        class="align-self-start"
        :prepend-icon="mdiArrowLeft"
        :aria-label="t(saveParticipantTranslationKeys.actions.back)"
      >
        {{ t(saveParticipantTranslationKeys.actions.back) }}
      </v-btn>
      <h1 class="text-h5">{{ pageTitle }}</h1>
    </div>
    <ParticipantForm :participant-id="participantId" />
  </v-container>
</template>

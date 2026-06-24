<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { mdiCloudOutline } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'

defineProps<{
  isCloudUsed: boolean
}>()

const emit = defineEmits<{
  'update:isCloudUsed': [value: boolean]
}>()

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

function handleCloudChange(value: boolean | null) {
  if (value === null) {
    return
  }

  emit('update:isCloudUsed', value)
}
</script>

<template>
  <v-col v-if="!isMobile" cols="2" class="d-flex justify-center">
    <v-icon :icon="mdiCloudOutline" size="64" aria-hidden="true" />
  </v-col>

  <v-col cols="12" md="10" class="d-flex flex-column">
    <div>
      <label class="font-weight-medium">{{ t(translationKeys.title) }}</label>
      <div class="text-medium-emphasis text-body-2">
        {{ t(translationKeys.description) }}
      </div>
    </div>
    <div class="d-flex justify-end mt-2">
      <v-switch
        :model-value="isCloudUsed"
        :aria-label="t(isCloudUsed ? translationKeys.enabled : translationKeys.disabled)"
        color="primary"
        hide-details
        @update:model-value="handleCloudChange"
      />
    </div>
  </v-col>
</template>

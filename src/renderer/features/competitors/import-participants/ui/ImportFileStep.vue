<script setup lang="ts">
import { ref } from 'vue'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'

const { t } = useTranslation()
const selectedFile = ref<File[]>([])
</script>

<template>
  <div class="import-file-step">
    <v-file-input
      v-model="selectedFile"
      :label="t(translationKeys.steps.file.inputLabel)"
      :hint="t(translationKeys.steps.file.hint)"
      persistent-hint
      accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
      prepend-icon=""
      :aria-label="t(translationKeys.steps.file.ariaInput)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { mdiLaptop, mdiMoonWaningCrescent, mdiThemeLightDark, mdiWhiteBalanceSunny } from '@mdi/js'
import { useTranslation } from '@shared/lib'
import { Theme } from '@shared/types/theme-modes'

import translationKeys from '../i18n/keys'
import { setThemeToStorage } from '../service/set-theme/theme-storage'

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const theme = useTheme()

const isMobile = computed(() => smAndDown.value)

function handleChangeTheme(value: (typeof Theme)[keyof typeof Theme]) {
  setThemeToStorage(value)
  theme.change(value)
}
</script>

<template>
  <v-col v-if="!isMobile" cols="2" class="d-flex justify-center">
    <v-icon :icon="mdiThemeLightDark" size="64"></v-icon>
  </v-col>

  <v-col cols="12" md="10" class="d-flex flex-column">
    <div>
      <label class="font-weight-medium">{{ t(translationKeys.theme.title) }}</label>
      <div class="text-medium-emphasis text-body-2">
        {{ t(translationKeys.theme.description) }}
      </div>
    </div>

    <div class="d-flex justify-end mt-2">
      <v-btn-toggle class="border" divided density="default">
        <v-tooltip :text="t(translationKeys.theme.tooltip.system)" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="mdiLaptop"
              :aria-label="t(translationKeys.theme.tooltip.system)"
              @click="handleChangeTheme(Theme.SYSTEM)"
            />
          </template>
        </v-tooltip>
        <v-tooltip :text="t(translationKeys.theme.tooltip.dark)" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="mdiMoonWaningCrescent"
              :aria-label="t(translationKeys.theme.tooltip.dark)"
              @click="handleChangeTheme(Theme.DARK)"
            />
          </template>
        </v-tooltip>
        <v-tooltip :text="t(translationKeys.theme.tooltip.light)" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="mdiWhiteBalanceSunny"
              :aria-label="t(translationKeys.theme.tooltip.light)"
              @click="handleChangeTheme(Theme.LIGHT)"
            />
          </template>
        </v-tooltip>
      </v-btn-toggle>
    </div>
  </v-col>
</template>

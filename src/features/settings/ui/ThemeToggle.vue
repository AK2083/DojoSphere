<script setup>
import { useDisplay, useTheme } from 'vuetify'
import { mdiLaptop, mdiMoonWaningCrescent, mdiWhiteBalanceSunny } from '@mdi/js'
import { useTranslation } from '@shared/lib/i18n/use-translation'
import { Theme } from '@shared/types/theme-modes'

import ThemeImage from '../assets/Theme.webp'
import { translationKeys } from '../i18n/keys'
import { setThemeToStorage } from '../model/theme-storage'

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const theme = useTheme()

const isMobile = computed(() => smAndDown.value)

function handleChangeTheme(value) {
  setThemeToStorage(value)
  theme.change(value)
}
</script>

<template>
  <v-col v-if="!isMobile" cols="2" class="d-flex justify-center">
    <v-img
      :src="ThemeImage"
      aspect-ratio="1"
      width="120"
      height="120"
      cover
      position="50% 10%"
      rounded="shaped"
      alt="Rei-Theme"
    />
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
        <v-btn
          :icon="mdiLaptop"
          :aria-label="t(translationKeys.theme.tooltip.system)"
          @click="handleChangeTheme(Theme.SYSTEM)"
        />
        <v-btn
          :icon="mdiMoonWaningCrescent"
          :aria-label="t(translationKeys.theme.tooltip.dark)"
          @click="handleChangeTheme(Theme.DARK)"
        />
        <v-btn
          :icon="mdiWhiteBalanceSunny"
          :aria-label="t(translationKeys.theme.tooltip.light)"
          @click="handleChangeTheme(Theme.LIGHT)"
        />
      </v-btn-toggle>
    </div>
  </v-col>
</template>

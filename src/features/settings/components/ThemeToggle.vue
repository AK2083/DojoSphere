<script setup>
import { useTheme } from 'vuetify'
import { setThemeToStorage } from '@features/settings/model/theme-storage'
import { Theme } from '@shared/types/theme-modes'
import themeImage from '@features/settings/assets/Theme.webp'
import { useDisplay } from 'vuetify'

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
      :src="themeImage"
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
      <label class="font-weight-medium">Theme</label>
      <div class="text-medium-emphasis text-body-2">
        Das Theme wird automatisch an die Systemeinstellungen angepasst. Du
        kannst es hier aber auch manuell auswählen.
      </div>
    </div>

    <div class="d-flex justify-end mt-2">
      <v-btn-toggle class="border" divided density="default">
        <v-btn
          icon="mdi-laptop"
          aria-label="System Theme Mode"
          @click="handleChangeTheme(Theme.SYSTEM)"
        />
        <v-btn
          icon="mdi-moon-waning-crescent"
          aria-label="Dark Mode"
          @click="handleChangeTheme(Theme.DARK)"
        />
        <v-btn
          icon="mdi-white-balance-sunny"
          aria-label="Light Mode"
          @click="handleChangeTheme(Theme.LIGHT)"
        />
      </v-btn-toggle>
    </div>
  </v-col>
</template>

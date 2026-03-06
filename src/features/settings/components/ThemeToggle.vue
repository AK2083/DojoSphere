<script setup>
import { useTheme } from 'vuetify'
import { setThemeToStorage } from '@features/settings/model/theme-storage'
import { Theme } from '@shared/types/theme-modes'
import themeImage from '../assets/Theme.webp'

const theme = useTheme()

function handleChangeTheme(value) {
  setThemeToStorage(value)
  theme.change(value)
}
</script>

<template>
  <v-col cols="2" class="d-flex justify-center">
    <v-img :src="themeImage" width="fit-content" rounded="xl" />
  </v-col>

  <v-col cols="10" class="d-flex flex-column">
    <div>
      <label class="font-weight-medium">Theme</label>
      <div class="text-medium-emphasis text-body-2">
        Das Theme wird automatisch an die Systemeinstellungen angepasst. Du
        kannst es hier aber auch manuell auswählen.
      </div>
    </div>

    <div class="d-flex justify-end mt-2">
      <v-btn-toggle class="border" divided density="default">
        <v-btn icon="mdi-laptop" @click="handleChangeTheme(Theme.SYSTEM)" />
        <v-btn
          icon="mdi-moon-waning-crescent"
          @click="handleChangeTheme(Theme.DARK)"
        />
        <v-btn
          icon="mdi-white-balance-sunny"
          @click="handleChangeTheme(Theme.LIGHT)"
        />
      </v-btn-toggle>
    </div>
  </v-col>
</template>

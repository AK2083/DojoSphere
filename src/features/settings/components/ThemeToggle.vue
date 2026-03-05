<script setup>
import { useTheme } from 'vuetify'
import { setThemeToStorage } from '@features/settings/model/theme-storage'
import { Theme } from '@shared/types/theme-modes'

const theme = useTheme()

function handleChangeTheme(value) {
  setThemeToStorage(value)
  theme.change(value)
}
</script>

<template>
  <v-col cols="12" md="8">
    <label class="font-weight-medium">Theme</label>
    <div class="text-medium-emphasis text-body-2">
      Das Theme wird automatisch an die Systemeinstellungen angepasst. Du kannst
      es hier aber auch manuell auswählen.
    </div>
  </v-col>

  <v-col cols="12" md="4" class="d-flex justify-end">
    <v-btn-toggle class="align-right border" divided>
      <v-btn icon="mdi-laptop" @click="handleChangeTheme(Theme.SYSTEM)"></v-btn>
      <v-btn
        icon="mdi-moon-waning-crescent"
        @click="handleChangeTheme(Theme.DARK)"
      ></v-btn>
      <v-btn
        icon="mdi-white-balance-sunny"
        @click="handleChangeTheme(Theme.LIGHT)"
      ></v-btn>
    </v-btn-toggle>
  </v-col>
</template>

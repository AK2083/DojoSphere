<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import router from '@app/providers/router'
import { useAuthSession, useSignOut } from '@features/authentication'
import { mdiAccountPlus, mdiCog, mdiLogout } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'

const drawer = ref(false)
const { smAndDown } = useDisplay()
const { isCloudLoggedIn } = useAuthSession()
const {
  logout,
  loading: isSigningOut,
  errorCode: logoutErrorCode,
  clearError: clearLogoutError
} = useSignOut()
const { t } = useTranslation()

const isMobile = computed(() => smAndDown.value)
const showLogoutError = ref(false)

async function handleLogout() {
  const success = await logout()
  showLogoutError.value = !success
}

function closeLogoutError() {
  showLogoutError.value = false
  clearLogoutError()
}

function navigateToRegister() {
  void router.push({ name: 'register' })
}

watch(
  smAndDown,
  (value) => {
    drawer.value = !value
  },
  { immediate: true }
)
</script>

<template>
  <v-app-bar v-if="isMobile" density="compact">
    <template #append>
      <v-tooltip
        v-if="!isCloudLoggedIn"
        :text="t(translationKeys.navigation.signUp)"
        location="bottom"
      >
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            :aria-label="t(translationKeys.navigation.ariaSignUp)"
            exact
            @click="navigateToRegister"
          >
            <v-icon :icon="mdiAccountPlus"></v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip
        v-if="isCloudLoggedIn"
        :text="t(translationKeys.navigation.logout)"
        location="bottom"
      >
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            :loading="isSigningOut"
            :disabled="isSigningOut"
            :aria-label="t(translationKeys.navigation.ariaLogout)"
            exact
            @click="handleLogout"
          >
            <v-icon :icon="mdiLogout"></v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip :text="t(translationKeys.navigation.settings)" location="bottom">
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            :aria-label="t(translationKeys.navigation.ariaSettings)"
            :to="{ name: 'settings' }"
          >
            <v-icon :icon="mdiCog"></v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" rail floating :temporary="isMobile" :permanent="!isMobile">
    <template #append>
      <v-list density="compact" role="navigation" :aria-label="t(translationKeys.label)" nav>
        <v-list-item
          v-if="!isCloudLoggedIn"
          :prepend-icon="mdiAccountPlus"
          :title="t(translationKeys.navigation.signUp)"
          :aria-label="t(translationKeys.navigation.ariaSignUp)"
          exact
          @click="navigateToRegister"
        />
        <v-list-item
          v-if="isCloudLoggedIn"
          :prepend-icon="mdiLogout"
          :title="t(translationKeys.navigation.logout)"
          :disabled="isSigningOut"
          :aria-label="t(translationKeys.navigation.ariaLogout)"
          exact
          @click="handleLogout"
        />
        <v-list-item
          :prepend-icon="mdiCog"
          :to="{ name: 'settings' }"
          :title="t(translationKeys.navigation.settings)"
          :aria-label="t(translationKeys.navigation.ariaSettings)"
        />
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-snackbar
    v-model="showLogoutError"
    color="error"
    location="top"
    timeout="5000"
    @update:model-value="(value) => !value && closeLogoutError()"
  >
    {{ t(logoutErrorCode ?? 'shared.error.unknown') }}
    <template #actions>
      <v-btn variant="text" @click="closeLogoutError">OK</v-btn>
    </template>
  </v-snackbar>
</template>

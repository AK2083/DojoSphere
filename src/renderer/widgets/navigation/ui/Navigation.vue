<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import router from '@app/providers/router'
import { useAuthSession, useSignOut } from '@features/authentication'
import { mdiAccountGroup, mdiAccountPlus, mdiCog, mdiLogout } from '@mdi/js'
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

const participantsLabel = computed(() => t(translationKeys.navigation.participants))
const signUpLabel = computed(() => t(translationKeys.navigation.signUp))
const logoutLabel = computed(() => t(translationKeys.navigation.logout))
const settingsLabel = computed(() => t(translationKeys.navigation.settings))

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
    <template #prepend>
      <v-tooltip :text="participantsLabel" location="bottom">
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            icon
            :aria-label="t(translationKeys.navigation.ariaParticipants)"
            :to="{ name: 'participants' }"
          >
            <v-icon :icon="mdiAccountGroup" aria-hidden="true" />
          </v-btn>
        </template>
      </v-tooltip>
    </template>

    <template #append>
      <v-tooltip v-if="!isCloudLoggedIn" :text="signUpLabel" location="bottom">
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            icon
            :aria-label="t(translationKeys.navigation.ariaSignUp)"
            exact
            @click="navigateToRegister"
          >
            <v-icon :icon="mdiAccountPlus" aria-hidden="true" />
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip v-if="isCloudLoggedIn" :text="logoutLabel" location="bottom">
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            icon
            :loading="isSigningOut"
            :disabled="isSigningOut"
            :aria-label="t(translationKeys.navigation.ariaLogout)"
            exact
            @click="handleLogout"
          >
            <v-icon :icon="mdiLogout" aria-hidden="true" />
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip :text="settingsLabel" location="bottom">
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            icon
            :aria-label="t(translationKeys.navigation.ariaSettings)"
            :to="{ name: 'settings' }"
          >
            <v-icon :icon="mdiCog" aria-hidden="true" />
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" rail floating :temporary="isMobile" :permanent="!isMobile">
    <nav :aria-label="t(translationKeys.mainLabel)">
      <v-list density="compact" nav>
        <v-list-item
          :prepend-icon="mdiAccountGroup"
          :to="{ name: 'participants' }"
          :title="participantsLabel"
          :aria-label="participantsLabel"
        />
      </v-list>
    </nav>

    <template #append>
      <nav :aria-label="t(translationKeys.label)">
        <v-list density="compact" nav>
          <v-list-item
            v-if="!isCloudLoggedIn"
            :prepend-icon="mdiAccountPlus"
            :title="signUpLabel"
            :aria-label="signUpLabel"
            exact
            @click="navigateToRegister"
          />
          <v-list-item
            v-if="isCloudLoggedIn"
            :prepend-icon="mdiLogout"
            :title="logoutLabel"
            :aria-label="logoutLabel"
            :disabled="isSigningOut"
            exact
            @click="handleLogout"
          />
          <v-list-item
            :prepend-icon="mdiCog"
            :to="{ name: 'settings' }"
            :title="settingsLabel"
            :aria-label="settingsLabel"
          />
        </v-list>
      </nav>
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

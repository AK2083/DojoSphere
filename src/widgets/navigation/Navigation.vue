<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { translationKeys, useAuthNavigation, useAuthSession } from '@features/authentication'
import { mdiAccount, mdiCardAccountDetails, mdiCog } from '@mdi/js'
import { useTranslation } from '@shared/lib'

const drawer = ref(false)
const { smAndDown } = useDisplay()
const { getAccountRoute } = useAuthNavigation()
const { isLoggedIn } = useAuthSession()
const { t } = useTranslation()

const accountIcon = computed(() => (isLoggedIn.value ? mdiAccount : mdiCardAccountDetails))

const accountTo = computed(() =>
  isLoggedIn.value ? { name: 'account' as const } : getAccountRoute()
)

const accountAriaLabel = computed(() =>
  isLoggedIn.value ? t(translationKeys.label) : t(translationKeys.ariaLabel)
)

const accountListTitle = computed(() =>
  isLoggedIn.value ? t(translationKeys.label) : t(translationKeys.ariaLabel)
)

const isMobile = computed(() => smAndDown.value)

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
      <v-btn icon :aria-label="accountAriaLabel" :to="accountTo" exact>
        <v-icon :icon="accountIcon"></v-icon>
      </v-btn>
      <v-btn icon aria-label="Settings" :to="{ name: 'settings' }">
        <v-icon :icon="mdiCog"></v-icon>
      </v-btn>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" rail floating :temporary="isMobile" :permanent="!isMobile">
    <template #append>
      <v-list nav density="compact">
        <v-list-item
          :prepend-icon="accountIcon"
          :to="accountTo"
          :title="accountListTitle"
          :aria-label="accountAriaLabel"
          exact
        />
        <v-list-item :prepend-icon="mdiCog" :to="{ name: 'settings' }" title="Settings" />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

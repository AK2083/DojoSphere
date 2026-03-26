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
      <v-btn
        v-if="isLoggedIn"
        icon
        :aria-label="t(translationKeys.label)"
        :to="{ name: 'account' }"
        exact
      >
        <v-icon :icon="mdiAccount"></v-icon>
      </v-btn>
      <v-btn
        icon
        :aria-label="t(translationKeys.navigation.ariaSignUp)"
        :to="getAccountRoute()"
        exact
      >
        <v-icon :icon="mdiCardAccountDetails"></v-icon>
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
          v-if="isLoggedIn"
          :prepend-icon="mdiAccount"
          :to="{ name: 'account' }"
          :title="t(translationKeys.navigation.signUp)"
          :aria-label="t(translationKeys.navigation.ariaSignUp)"
          exact
        />
        <v-list-item
          :prepend-icon="mdiCardAccountDetails"
          :to="getAccountRoute()"
          :title="t(translationKeys.ariaLabel)"
          :aria-label="t(translationKeys.ariaLabel)"
          exact
        />
        <v-list-item :prepend-icon="mdiCog" :to="{ name: 'settings' }" title="Settings" />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

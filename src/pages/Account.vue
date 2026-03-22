<script setup lang="ts">
import { computed } from 'vue'
import { translationKeys, useAuthSession } from '@features/authentication'
import { useTranslation } from '@shared/lib'

const { t } = useTranslation()
const { user } = useAuthSession()

const displayName = computed(() => {
  const u = user.value
  if (!u) return t(translationKeys.account.fallbackName)

  const meta = u.user_metadata as { full_name?: string; name?: string } | undefined
  return (
    meta?.full_name ||
    meta?.name ||
    u.email?.split('@')[0] ||
    t(translationKeys.account.fallbackName)
  )
})
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-8" max-width="480" width="100%">
      <v-card-title class="text-h4 text-center">
        {{ t(translationKeys.account.greeting, { name: displayName }) }}
      </v-card-title>
    </v-card>
  </v-container>
</template>

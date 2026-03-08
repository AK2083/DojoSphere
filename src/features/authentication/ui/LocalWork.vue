<script setup>
import { LocalImage } from '@features/authentication/assets'
import { useTranslation, translationKeys } from '@features/authentication/i18n'

const { t } = useTranslation()
</script>

<template>
  <v-card
    title="Lokales Arbeiten"
    subtitle="Hier kann lokal weitergearbeitet werden."
    class="border px-4 py-4"
  >
    <template #prepend>
      <v-img
        :src="LocalImage"
        width="64"
        height="64"
        rounded="shaped"
        cover
        class="border"
      />
    </template>

    <template #text>
      <span>{{ t(translationKeys.useLocal.description) }}</span>
    </template>

    <template #actions>
      <v-btn
        :text="t(translationKeys.useLocal.submit)"
        variant="tonal"
        block
      ></v-btn>
    </template>
  </v-card>
</template>

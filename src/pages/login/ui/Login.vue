<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LoginForm } from '@features/authentication/signin-user'

const users = ref<any[]>([])

onMounted(async () => {
  try {
    const health = await globalThis.window.api.dbHealthcheck()
    globalThis.console.log('SQLite verbunden:', health.ok, '- Version:', health.version)

    const rawUsers = await globalThis.window.api.getUsers()

    users.value = rawUsers.map((user) => ({
      ...user,
      data: typeof user.data === 'string' ? JSON.parse(user.data) : user.data
    }))

    globalThis.console.log('Geladene User:', users.value)
  } catch (error) {
    globalThis.console.error('SQLite-Test fehlgeschlagen:', error)
  }
})
</script>

<template>
  <v-container class="h-100 d-flex align-start align-md-center justify-center overflow-y-auto py-4">
    <v-row class="w-100" justify="center">
      <v-col cols="12" lg="8">
        <LoginForm />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { mdiEye, mdiEyeOff } from '@mdi/js'

const props = defineProps<{
  password: string
  repeatedPassword: string
  rules: any[]
  labelPassword: string
  ariaLabelPassword: string
  labelRepeatedPassword: string
  ariaLabelRepeatedPassword: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (eventname: 'update:password', value: string): void
  (eventname: 'update:repassword', value: string): void
  (eventname: 'valid-change', value: boolean): void
}>()

const form = ref<VForm | null>(null)
const showPassword = ref(false)
const showRepeatedPassword = ref(false)
const isValid = ref(false)

const passwordsMatch = computed<boolean>(
  () => props.password === props.repeatedPassword && !!props.password
)

const repeatPasswordRules = [
  ...props.rules,
  (v: string) => v === props.password || 'Passwörter stimmen nicht überein'
]

async function handleSubmit() {
  if (!form.value) return

  const result = await form.value?.validate()
  if (!result?.valid) return

  if (!passwordsMatch.value) return
}

watch(
  [isValid, passwordsMatch],
  ([formValid, match]) => {
    emit('valid-change', formValid && match)
  },
  { immediate: true }
)
</script>

<template>
  <v-form ref="form" v-model="isValid" @submit.prevent="handleSubmit">
    <v-text-field
      :model-value="password"
      density="default"
      :rules="repeatPasswordRules"
      :label="labelPassword"
      :type="showPassword ? 'text' : 'password'"
      required
      autocomplete="new-password"
      :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
      @click:append-inner="showPassword = !showPassword"
      @update:model-value="emit('update:password', $event)"
      :aria-label="ariaLabelPassword"
    />

    <v-text-field
      :model-value="repeatedPassword"
      density="default"
      :rules="repeatPasswordRules"
      :label="labelRepeatedPassword"
      :type="showRepeatedPassword ? 'text' : 'password'"
      required
      autocomplete="new-password"
      :append-inner-icon="showRepeatedPassword ? mdiEyeOff : mdiEye"
      @click:append-inner="showRepeatedPassword = !showRepeatedPassword"
      @update:model-value="emit('update:repassword', $event)"
      :aria-label="ariaLabelRepeatedPassword"
    />
  </v-form>
</template>

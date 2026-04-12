<script setup lang="ts">
import { watch } from 'vue'
import { mdiEmailOutline } from '@mdi/js'
import OtpInput from '@shared/ui/OtpInput.vue'

const props = defineProps<{
  stepTitle: string
  stepSubTitle: string
  otp: string | null

  isMailAvailable: boolean
  resendAriaLabel: string
  resendLabel: string

  alertText: string
  alertType: 'error' | 'success'
  showAlert: boolean

  loading?: boolean
}>()

const emit = defineEmits<{
  (eventname: 'update:otp', value: string): void
  (eventname: 'clear-error'): void
  (eventname: 'resend'): void
  (eventname: 'valid-change', value: boolean): void
}>()

watch(
  () => props.otp,
  (val) => emit('valid-change', (val?.length ?? 0) === 6),
  { immediate: true }
)
</script>

<template>
  <v-card class="pa-4" variant="tonal">
    <template #title>
      <div class="v-card-title" id="otpTitle">{{ stepTitle }}</div>
    </template>

    <template #subtitle>
      <div class="v-card-subtitle" id="otpDescription">{{ stepSubTitle }}</div>
    </template>

    <template #prepend>
      <v-avatar color="blue-darken-2">
        <v-icon :icon="mdiEmailOutline" size="30"></v-icon>
      </v-avatar>
    </template>

    <v-card-text>
      <OtpInput
        :modelValue="props.otp ?? ''"
        aria-labelledby="titleId"
        aria-describedby="descId"
        autocomplete="one-time-code"
        autofocus
        @update:model-value="emit('update:otp', $event)"
        @finish="emit('clear-error')"
      ></OtpInput>
      <v-alert v-if="showAlert" :text="alertText" :type="alertType" class="mt-2"></v-alert>
    </v-card-text>
    <v-card-actions>
      <v-btn
        block
        color="primary"
        variant="text"
        :loading="loading"
        :disabled="!isMailAvailable"
        :aria-label="resendAriaLabel"
        @click="emit('resend')"
      >
        {{ resendLabel }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

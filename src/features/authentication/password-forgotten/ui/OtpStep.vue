<script setup lang="ts">
import { watch } from 'vue'
import OtpInput from '@shared/ui/OtpInput.vue'

const props = defineProps<{
  stepTitle: string
  otp: string | null
  otpAriaLabel: string
  isMailAvailable: boolean
  resendAriaLabel: string
  resendLabel: string
  resendSuccessLabel: string
  showResendSuccessLabel: boolean
  otpErrorLabel: string
  showOtpError: boolean
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
  (val) => {
    emit('valid-change', (val?.length ?? 0) === 6)
  },
  { immediate: true }
)
</script>

<template>
  <div class="d-flex flex-column ga-3">
    <p class="mb-0">{{ stepTitle }}</p>

    <OtpInput
      :modelValue="props.otp ?? ''"
      :aria-label="props.otpAriaLabel"
      @update:model-value="emit('update:otp', $event)"
      @finish="emit('clear-error')"
    ></OtpInput>

    <v-alert v-if="showOtpError" :text="otpErrorLabel" type="error" class="mt-2"></v-alert>
  </div>

  <div class="mt-4">
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

    <v-alert v-if="false" :text="resendSuccessLabel" type="success" class="mt-2"></v-alert>
  </div>
</template>

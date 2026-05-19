import type { Meta, StoryObj } from '@storybook/vue3-vite'

import OtpInput from './OtpInput.vue'

const meta = {
  title: 'Shared/UI/OtpInput',
  component: OtpInput,
  parameters: {
    layout: 'centered'
  },
  args: {
    modelValue: '',
    ariaLabel: 'OTP input'
  }
} satisfies Meta<typeof OtpInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

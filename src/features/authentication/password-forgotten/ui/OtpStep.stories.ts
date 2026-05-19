import type { Meta, StoryObj } from '@storybook/vue3-vite'

import OtpStep from './OtpStep.vue'

const meta = {
  title: 'Features/Authentication/PasswordForgotten/OtpStep',
  component: OtpStep,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    email: 'user@example.com'
  }
} satisfies Meta<typeof OtpStep>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

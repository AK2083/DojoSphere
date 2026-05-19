import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ResendOneTimePassword from './ResendOneTimePassword.vue'

const meta = {
  title: 'Features/Authentication/PasswordForgotten/ResendOneTimePassword',
  component: ResendOneTimePassword,
  parameters: {
    layout: 'centered'
  },
  args: {
    email: 'user@example.com'
  }
} satisfies Meta<typeof ResendOneTimePassword>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

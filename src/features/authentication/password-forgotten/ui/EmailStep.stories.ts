import type { Meta, StoryObj } from '@storybook/vue3-vite'

import EmailStep from './EmailStep.vue'

const meta = {
  title: 'Features/Authentication/PasswordForgotten/EmailStep',
  component: EmailStep,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof EmailStep>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import NewPasswordStep from './NewPasswordStep.vue'

const meta = {
  title: 'Features/Authentication/PasswordForgotten/NewPasswordStep',
  component: NewPasswordStep,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof NewPasswordStep>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

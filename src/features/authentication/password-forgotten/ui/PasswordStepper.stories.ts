import type { Meta, StoryObj } from '@storybook/vue3-vite'

import PasswordStepper from './PasswordStepper.vue'

const meta = {
  title: 'Features/Authentication/PasswordForgotten/PasswordStepper',
  component: PasswordStepper,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof PasswordStepper>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

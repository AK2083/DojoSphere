import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Confirmation from './Confirmation.vue'

const meta = {
  title: 'Features/Authentication/ConfirmUser/Confirmation',
  component: Confirmation,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof Confirmation>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

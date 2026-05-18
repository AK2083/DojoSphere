import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Account from './Account.vue'

const meta = {
  title: 'Pages/Account/Account',
  component: Account,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Account>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Welcome from './Welcome.vue'

const meta = {
  title: 'Pages/Dashboard/Welcome',
  component: Welcome,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Welcome>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

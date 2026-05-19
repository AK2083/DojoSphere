import type { Meta, StoryObj } from '@storybook/vue3-vite'

import LocalWork from './LocalWork.vue'

const meta = {
  title: 'Features/Authentication/WorkLocal/LocalWork',
  component: LocalWork,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof LocalWork>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

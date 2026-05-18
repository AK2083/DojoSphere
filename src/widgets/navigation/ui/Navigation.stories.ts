import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Navigation from './Navigation.vue'

const meta = {
  title: 'Widgets/Navigation/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Navigation>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

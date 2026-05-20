import type { Meta, StoryObj } from '@storybook/vue3-vite'

import BottomNavigation from './BottomNavigation.vue'

const meta = {
  title: 'Widgets/Navigation/BottomNavigation',
  component: BottomNavigation,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof BottomNavigation>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector('footer')

    if (!footer) {
      throw new Error('Bottom navigation footer not found.')
    }

    const chips = footer.querySelectorAll('.v-chip')

    if (chips.length !== 2) {
      throw new Error(`Expected 2 status chips, found ${chips.length}.`)
    }

    const icons = footer.querySelectorAll('.v-icon')

    if (icons.length < 2) {
      throw new Error(`Expected at least 2 status icons, found ${icons.length}.`)
    }
  }
}

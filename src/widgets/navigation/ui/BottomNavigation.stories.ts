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

    const branchLabel = canvasElement.querySelector('span')

    if (!branchLabel || !branchLabel.textContent?.trim()) {
      throw new Error('Branch label is missing in bottom navigation.')
    }
  }
}

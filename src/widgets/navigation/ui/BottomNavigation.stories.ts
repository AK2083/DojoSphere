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

    const footerText = footer.textContent?.replace(/\s+/g, ' ').trim() ?? ''

    if (!/cloudless|lokal/i.test(footerText)) {
      throw new Error('Cloud status label not found (expected Cloudless/Lokal).')
    }

    if (!/online|offline/i.test(footerText)) {
      throw new Error('Network status label not found (expected Online/Offline).')
    }
  }
}

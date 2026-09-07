import { onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ClubsPage from './ClubsPage.vue'

function setMobileViewport(): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 390
  })
  window.dispatchEvent(new Event('resize'))
}

const meta = {
  title: 'Pages/Clubs/ClubsPage',
  component: ClubsPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ClubsPage>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  render: () => ({
    components: { ClubsPage },
    setup() {
      onMounted(() => {
        setMobileViewport()
      })
    },
    template: '<ClubsPage />'
  })
}

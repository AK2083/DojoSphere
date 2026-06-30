import { onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantsPage from './ParticipantsPage.vue'

function setMobileViewport(): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 390
  })
  window.dispatchEvent(new Event('resize'))
}

const meta = {
  title: 'Pages/Participants/ParticipantsPage',
  component: ParticipantsPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ParticipantsPage>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  render: () => ({
    components: { ParticipantsPage },
    setup() {
      onMounted(() => {
        setMobileViewport()
      })
    },
    template: '<ParticipantsPage />'
  })
}

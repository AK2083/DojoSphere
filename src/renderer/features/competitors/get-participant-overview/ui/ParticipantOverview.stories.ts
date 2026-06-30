import { onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantOverview from './ParticipantOverview.vue'

function setMobileViewport(): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 390
  })
  window.dispatchEvent(new Event('resize'))
}

const meta = {
  title: 'Features/Competitors/GetParticipantOverview/ParticipantOverview',
  component: ParticipantOverview,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof ParticipantOverview>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  render: () => ({
    components: { ParticipantOverview },
    template: `
      <div style="max-width: 1200px; margin: 0 auto;">
        <ParticipantOverview />
      </div>
    `
  })
}

export const Mobile: Story = {
  render: () => ({
    components: { ParticipantOverview },
    setup() {
      onMounted(() => {
        setMobileViewport()
      })
    },
    template: `
      <div style="max-width: 390px; margin: 0 auto;">
        <ParticipantOverview />
      </div>
    `
  })
}

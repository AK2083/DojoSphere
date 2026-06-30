import { onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantOverviewSection from './ParticipantOverviewSection.vue'

function setMobileViewport(): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 390
  })
  window.dispatchEvent(new Event('resize'))
}

const meta = {
  title: 'Features/Competitors/GetParticipantOverview/ParticipantOverviewSection',
  component: ParticipantOverviewSection,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof ParticipantOverviewSection>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  render: () => ({
    components: { ParticipantOverviewSection },
    template: `
      <div style="max-width: 1200px; margin: 0 auto;">
        <ParticipantOverviewSection />
      </div>
    `
  })
}

export const Mobile: Story = {
  render: () => ({
    components: { ParticipantOverviewSection },
    setup() {
      onMounted(() => {
        setMobileViewport()
      })
    },
    template: `
      <div style="max-width: 390px; margin: 0 auto;">
        <ParticipantOverviewSection />
      </div>
    `
  })
}

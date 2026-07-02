import { onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantOverviewActions from './ParticipantOverviewActions.vue'

const meta = {
  title: 'Features/Competitors/GetParticipantOverview/ParticipantOverviewActions',
  component: ParticipantOverviewActions,
  parameters: {
    layout: 'padded'
  },
  args: {
    addLabel: 'Add participant',
    isMobile: false
  }
} satisfies Meta<typeof ParticipantOverviewActions>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  render: (args) => ({
    components: { ParticipantOverviewActions },
    setup() {
      return { args }
    },
    template: `
      <div style="max-width: 48rem;">
        <ParticipantOverviewActions v-bind="args" />
      </div>
    `
  })
}

export const Mobile: Story = {
  args: {
    isMobile: true
  },
  render: (args) => ({
    components: { ParticipantOverviewActions },
    setup() {
      onMounted(() => {
        Object.defineProperty(window, 'innerWidth', {
          configurable: true,
          value: 390
        })
        window.dispatchEvent(new Event('resize'))
      })

      return { args }
    },
    template: `
      <div style="max-width: 390px;">
        <ParticipantOverviewActions v-bind="args" />
      </div>
    `
  })
}

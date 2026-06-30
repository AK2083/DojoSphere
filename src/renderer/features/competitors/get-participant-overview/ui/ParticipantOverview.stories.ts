import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantOverview from './ParticipantOverview.vue'

const meta = {
  title: 'Features/Competitors/GetParticipantOverview/ParticipantOverview',
  component: ParticipantOverview,
  parameters: {
    layout: 'padded'
  },
  render: () => ({
    components: { ParticipantOverview },
    template: `
      <div style="max-width: 1200px; margin: 0 auto;">
        <ParticipantOverview />
      </div>
    `
  })
} satisfies Meta<typeof ParticipantOverview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

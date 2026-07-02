import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantEntryPlaceholder from './ParticipantEntryPlaceholder.vue'

const meta = {
  title: 'Features/Competitors/GetParticipantOverview/ParticipantEntryPlaceholder',
  component: ParticipantEntryPlaceholder,
  parameters: {
    layout: 'padded'
  },
  render: () => ({
    components: { ParticipantEntryPlaceholder },
    template: `
      <div style="max-width: 28rem;">
        <ParticipantEntryPlaceholder />
      </div>
    `
  })
} satisfies Meta<typeof ParticipantEntryPlaceholder>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LoadingGrid: Story = {
  render: () => ({
    components: { ParticipantEntryPlaceholder },
    template: `
      <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));">
        <ParticipantEntryPlaceholder v-for="index in 3" :key="index" />
      </div>
    `
  })
}

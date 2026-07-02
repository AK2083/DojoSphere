import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { storyFieldHeaders, storyParticipants } from './participant-overview-story-fixtures'
import ParticipantEntry from './ParticipantEntry.vue'

const meta = {
  title: 'Features/Competitors/GetParticipantOverview/ParticipantEntry',
  component: ParticipantEntry,
  parameters: {
    layout: 'padded'
  },
  args: {
    participant: storyParticipants[0],
    fieldHeaders: storyFieldHeaders
  }
} satisfies Meta<typeof ParticipantEntry>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutClub: Story = {
  args: {
    participant: {
      ...storyParticipants[0]!,
      club: ''
    }
  }
}

export const Grid: Story = {
  render: (args) => ({
    components: { ParticipantEntry },
    setup() {
      return { args, participants: storyParticipants }
    },
    template: `
      <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));">
        <ParticipantEntry
          v-for="participant in participants"
          :key="participant.id"
          :participant="participant"
          :field-headers="args.fieldHeaders"
        />
      </div>
    `
  })
}

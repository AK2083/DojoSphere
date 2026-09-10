import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { storyClubs, storyFieldHeaders } from './club-overview-story-fixtures'
import ClubEntry from './ClubEntry.vue'

const meta = {
  title: 'Features/Clubs/GetClubOverview/ClubEntry',
  component: ClubEntry,
  parameters: {
    layout: 'padded'
  },
  args: {
    club: storyClubs[0],
    fieldHeaders: storyFieldHeaders
  }
} satisfies Meta<typeof ClubEntry>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Inactive: Story = {
  args: {
    club: storyClubs[1]
  }
}

export const Minimal: Story = {
  args: {
    club: storyClubs[2]
  }
}

export const Grid: Story = {
  render: (args) => ({
    components: { ClubEntry },
    setup() {
      return { args, clubs: storyClubs }
    },
    template: `
      <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));">
        <ClubEntry
          v-for="club in clubs"
          :key="club.id"
          :club="club"
          :field-headers="args.fieldHeaders"
        />
      </div>
    `
  })
}

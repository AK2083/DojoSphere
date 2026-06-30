import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { storyHeaders, storyItems, storySortBy } from './participant-overview-story-fixtures'
import ParticipantOverviewMobile from './ParticipantOverviewMobile.vue'

const meta = {
  title: 'Features/Competitors/GetParticipantOverview/ParticipantOverviewMobile',
  component: ParticipantOverviewMobile,
  parameters: {
    layout: 'padded'
  },
  args: {
    headers: storyHeaders,
    items: storyItems,
    loading: false,
    sortBy: storySortBy
  },
  render: (args) => ({
    components: { ParticipantOverviewMobile },
    setup() {
      const sortBy = ref([...args.sortBy])

      return {
        sortBy,
        args
      }
    },
    template: `
      <div style="max-width: 390px; margin: 0 auto;">
        <ParticipantOverviewMobile
          v-model:sort-by="sortBy"
          :headers="args.headers"
          :items="args.items"
          :loading="args.loading"
        />
      </div>
    `
  })
} satisfies Meta<typeof ParticipantOverviewMobile>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    loading: true
  }
}

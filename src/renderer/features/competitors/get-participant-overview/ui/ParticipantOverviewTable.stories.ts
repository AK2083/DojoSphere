import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { storyHeaders, storyItems, storySortBy } from './participant-overview-story-fixtures'
import ParticipantOverviewTable from './ParticipantOverviewTable.vue'

const meta = {
  title: 'Features/Competitors/GetParticipantOverview/ParticipantOverviewTable',
  component: ParticipantOverviewTable,
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
    components: { ParticipantOverviewTable },
    setup() {
      const sortBy = ref([...args.sortBy])

      return {
        sortBy,
        args
      }
    },
    template: `
      <div style="max-width: 1200px; margin: 0 auto;">
        <ParticipantOverviewTable
          v-model:sort-by="sortBy"
          :headers="args.headers"
          :items="args.items"
          :loading="args.loading"
        />
      </div>
    `
  })
} satisfies Meta<typeof ParticipantOverviewTable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    loading: true
  }
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantList from './ParticipantList.vue'

const meta = {
  title: 'Features/Competitors/ParticipantList/ParticipantList',
  component: ParticipantList,
  parameters: {
    layout: 'fullscreen'
  },
  render: () => ({
    components: { ParticipantList },
    template: `
      <v-container class="pa-6" max-width="1200">
        <ParticipantList />
      </v-container>
    `
  })
} satisfies Meta<typeof ParticipantList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}

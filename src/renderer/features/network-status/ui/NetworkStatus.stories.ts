import type { Meta, StoryObj } from '@storybook/vue3-vite'

import NetworkStatus from './NetworkStatus.vue'

const meta = {
  title: 'Features/NetworkStatus/NetworkStatus',
  component: NetworkStatus,
  parameters: {
    layout: 'fullscreen'
  },
  render: () => ({
    components: { NetworkStatus },
    template: `
      <v-container class="fill-height">
        <v-row class="fill-height align-center justify-center">
          <NetworkStatus />
        </v-row>
      </v-container>
    `
  })
} satisfies Meta<typeof NetworkStatus>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

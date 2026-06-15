import type { Meta, StoryObj } from '@storybook/vue3-vite'

import CloudStatus from './CloudStatus.vue'

const meta = {
  title: 'Features/CloudStatus/CloudStatus',
  component: CloudStatus,
  parameters: {
    layout: 'fullscreen'
  },
  render: () => ({
    components: { CloudStatus },
    template: `
      <v-container class="fill-height">
        <v-row class="fill-height align-center justify-center">
          <CloudStatus />
        </v-row>
      </v-container>
    `
  })
} satisfies Meta<typeof CloudStatus>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

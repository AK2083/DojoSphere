import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantImportStepper from './ParticipantImportStepper.vue'

const meta = {
  title: 'Features/Competitors/ImportParticipants/ParticipantImportStepper',
  component: ParticipantImportStepper,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof ParticipantImportStepper>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { ParticipantImportStepper },
    template: `
      <v-card variant="outlined" max-width="48rem">
        <ParticipantImportStepper />
      </v-card>
    `
  })
}

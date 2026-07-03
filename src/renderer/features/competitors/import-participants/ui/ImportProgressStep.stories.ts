import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { IMPORT_PREVIEW_PARTICIPANTS } from '../model/import-preview-participants'
import ImportProgressStep from './ImportProgressStep.vue'

const meta = {
  title: 'Features/Competitors/ImportParticipants/ImportProgressStep',
  component: ImportProgressStep,
  parameters: {
    layout: 'padded'
  },
  args: {
    progress: 45,
    isComplete: false,
    results: IMPORT_PREVIEW_PARTICIPANTS.slice(0, 2)
  }
} satisfies Meta<typeof ImportProgressStep>

export default meta

type Story = StoryObj<typeof meta>

export const InProgress: Story = {
  render: (args) => ({
    components: { ImportProgressStep },
    setup() {
      return { args }
    },
    template: `
      <v-card variant="outlined" max-width="40rem">
        <ImportProgressStep v-bind="args" />
      </v-card>
    `
  })
}

export const Complete: Story = {
  args: {
    progress: 100,
    isComplete: true,
    results: IMPORT_PREVIEW_PARTICIPANTS
  },
  render: (args) => ({
    components: { ImportProgressStep },
    setup() {
      return { args }
    },
    template: `
      <v-card variant="outlined" max-width="40rem">
        <ImportProgressStep v-bind="args" />
      </v-card>
    `
  })
}

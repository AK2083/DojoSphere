import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ImportFileStep from './ImportFileStep.vue'

const meta = {
  title: 'Features/Competitors/ImportParticipants/ImportFileStep',
  component: ImportFileStep,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof ImportFileStep>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { ImportFileStep },
    template: `
      <v-card variant="outlined" max-width="40rem">
        <ImportFileStep />
      </v-card>
    `
  })
}

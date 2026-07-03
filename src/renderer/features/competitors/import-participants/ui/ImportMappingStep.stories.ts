import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ImportMappingStep from './ImportMappingStep.vue'

const meta = {
  title: 'Features/Competitors/ImportParticipants/ImportMappingStep',
  component: ImportMappingStep,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof ImportMappingStep>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { ImportMappingStep },
    template: `
      <v-card variant="outlined" max-width="40rem">
        <ImportMappingStep />
      </v-card>
    `
  })
}

import { defineComponent, h } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { provideParticipantImport } from '../model/use-participant-import'
import ImportFileStep from './ImportFileStep.vue'

const ImportStoryHarness = defineComponent({
  name: 'ImportStoryHarness',
  setup(_, { slots }) {
    provideParticipantImport()

    return () => h('div', slots.default?.())
  }
})

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
    components: { ImportFileStep, ImportStoryHarness },
    template: `
      <v-card variant="outlined" max-width="40rem">
        <ImportStoryHarness>
          <ImportFileStep />
        </ImportStoryHarness>
      </v-card>
    `
  })
}

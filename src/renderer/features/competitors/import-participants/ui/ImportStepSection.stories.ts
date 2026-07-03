import { mdiMicrosoftExcel } from '@mdi/js'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ImportFileStep from './ImportFileStep.vue'
import ImportStepSection from './ImportStepSection.vue'

const meta = {
  title: 'Features/Competitors/ImportParticipants/ImportStepSection',
  component: ImportStepSection,
  parameters: {
    layout: 'padded'
  },
  args: {
    title: 'Select file',
    subtitle: 'Choose an Excel file with participant data to import.',
    icon: mdiMicrosoftExcel
  }
} satisfies Meta<typeof ImportStepSection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { ImportStepSection, ImportFileStep },
    setup() {
      return { args }
    },
    template: `
      <div style="max-width: 40rem;">
        <ImportStepSection v-bind="args">
          <ImportFileStep />
        </ImportStepSection>
      </div>
    `
  })
}

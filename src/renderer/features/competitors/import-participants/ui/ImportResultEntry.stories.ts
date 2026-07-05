import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { IMPORT_RESULT_FIXTURES } from '../model/import-result-fixtures'
import ImportResultEntry from './ImportResultEntry.vue'

const meta = {
  title: 'Features/Competitors/ImportParticipants/ImportResultEntry',
  component: ImportResultEntry,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof ImportResultEntry>

export default meta

type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: {
    participant: IMPORT_RESULT_FIXTURES[0]
  }
}

export const Failure: Story = {
  args: {
    participant: IMPORT_RESULT_FIXTURES[2]
  }
}

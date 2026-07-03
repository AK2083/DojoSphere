import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { IMPORT_PREVIEW_PARTICIPANTS } from '../model/import-preview-participants'
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
    participant: IMPORT_PREVIEW_PARTICIPANTS[0]
  }
}

export const Failure: Story = {
  args: {
    participant: IMPORT_PREVIEW_PARTICIPANTS[2]
  }
}

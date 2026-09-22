import type { Meta, StoryObj } from '@storybook/vue3-vite'

import SyncAssociationsDialog from './SyncAssociationsDialog.vue'

const sampleResults = [
  { id: '1', name: 'Judoclub Nord e.V.', success: true as boolean | null },
  { id: '2', name: 'Budokan Süd', success: true as boolean | null },
  { id: '3', name: 'Dojo West', success: false as boolean | null },
  { id: '4', name: 'Judo Akademie Ost', success: null as boolean | null }
]

const meta = {
  title: 'Features/Associations/SyncAssociations/SyncAssociationsDialog',
  component: SyncAssociationsDialog,
  parameters: {
    layout: 'padded'
  },
  args: {
    modelValue: true,
    phase: 'legal',
    progress: { processed: 0, total: 0, currentName: '' },
    results: [],
    errorMessage: null
  }
} satisfies Meta<typeof SyncAssociationsDialog>

export default meta

type Story = StoryObj<typeof meta>

/** Initial legal notice shown before the user confirms the download. */
export const Legal: Story = {}

/** Legal phase after a sync error – error banner is visible. */
export const LegalWithError: Story = {
  args: {
    errorMessage: 'Network timeout – please check your internet connection.'
  }
}

/** Syncing phase with percentage progress and a live result list. */
export const Syncing: Story = {
  args: {
    phase: 'syncing',
    progress: {
      processed: 2,
      total: 4,
      currentName: 'Budokan Süd'
    },
    results: sampleResults
  }
}

/** Syncing phase before the first progress event arrives (indeterminate). */
export const SyncingBeforeFirstProgress: Story = {
  args: {
    phase: 'syncing',
    progress: {
      processed: 0,
      total: 0,
      currentName: ''
    },
    results: sampleResults.map((item) => ({ ...item, success: null }))
  }
}

/** Finished import with check / cross icons and a close action. */
export const Done: Story = {
  args: {
    phase: 'done',
    progress: {
      processed: 4,
      total: 4,
      currentName: 'Judo Akademie Ost'
    },
    results: sampleResults.map((item, index) => ({
      ...item,
      success: index < 3
    }))
  }
}

/** Finished sync with nothing to import – empty state stays open until closed. */
export const DoneEmpty: Story = {
  args: {
    phase: 'done',
    progress: { processed: 0, total: 0, currentName: '' },
    results: []
  }
}

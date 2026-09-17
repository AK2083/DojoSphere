import type { Meta, StoryObj } from '@storybook/vue3-vite'

import SyncAssociationsDialog from './SyncAssociationsDialog.vue'

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
    errorMessage: null,
    isNotSignedIn: false,
    syncedCount: 0
  }
} satisfies Meta<typeof SyncAssociationsDialog>

export default meta

type Story = StoryObj<typeof meta>

/** Initial legal notice shown before the user confirms the download. */
export const Legal: Story = {}

/** Legal phase with a "not signed in" warning. */
export const LegalNotSignedIn: Story = {
  args: {
    isNotSignedIn: true
  }
}

/** Legal phase after a sync error – error banner is visible. */
export const LegalWithError: Story = {
  args: {
    errorMessage: 'Network timeout – please check your internet connection.'
  }
}

/** Syncing phase while associations are being downloaded and applied. */
export const Syncing: Story = {
  args: {
    phase: 'syncing',
    progress: {
      processed: 12,
      total: 47,
      currentName: 'Judoclub Nord e.V.'
    }
  }
}

/** Syncing phase before the first progress event arrives (spinner only). */
export const SyncingBeforeFirstProgress: Story = {
  args: {
    phase: 'syncing',
    progress: {
      processed: 0,
      total: 0,
      currentName: ''
    }
  }
}

/** Done phase – associations were successfully synced. */
export const Done: Story = {
  args: {
    phase: 'done',
    syncedCount: 47
  }
}

/** Done phase – all associations were already up to date. */
export const DoneNothingNew: Story = {
  args: {
    phase: 'done',
    syncedCount: 0
  }
}

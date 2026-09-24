import type { Meta, StoryObj } from '@storybook/vue3-vite'

import type { SyncResultItem } from '../model/use-sync-associations'
import SyncResultEntry from './SyncResultEntry.vue'

const meta = {
  title: 'Features/Associations/SyncAssociations/SyncResultEntry',
  component: SyncResultEntry,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof SyncResultEntry>

export default meta

type Story = StoryObj<typeof meta>

const successItem: SyncResultItem = {
  id: '1',
  name: 'Judoclub Nord e.V.',
  success: true
}

const failureItem: SyncResultItem = {
  id: '2',
  name: 'Dojo West',
  success: false
}

const pendingItem: SyncResultItem = {
  id: '3',
  name: 'Budokan Süd',
  success: null
}

export const Success: Story = {
  args: {
    item: successItem
  }
}

export const Failure: Story = {
  args: {
    item: failureItem
  }
}

export const Pending: Story = {
  args: {
    item: pendingItem
  }
}

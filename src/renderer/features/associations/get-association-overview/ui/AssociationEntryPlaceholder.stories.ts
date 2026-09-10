import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AssociationEntryPlaceholder from './AssociationEntryPlaceholder.vue'

const meta = {
  title: 'Features/Associations/GetAssociationOverview/AssociationEntryPlaceholder',
  component: AssociationEntryPlaceholder,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof AssociationEntryPlaceholder>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

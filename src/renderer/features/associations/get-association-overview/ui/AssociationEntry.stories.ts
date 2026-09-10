import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { storyAssociations, storyFieldHeaders } from './association-overview-story-fixtures'
import AssociationEntry from './AssociationEntry.vue'

const meta = {
  title: 'Features/Associations/GetAssociationOverview/AssociationEntry',
  component: AssociationEntry,
  parameters: {
    layout: 'padded'
  },
  args: {
    association: storyAssociations[0],
    fieldHeaders: storyFieldHeaders
  }
} satisfies Meta<typeof AssociationEntry>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Inactive: Story = {
  args: {
    association: storyAssociations[1]
  }
}

export const Minimal: Story = {
  args: {
    association: storyAssociations[2]
  }
}

export const Grid: Story = {
  render: (args) => ({
    components: { AssociationEntry },
    setup() {
      return { args, associations: storyAssociations }
    },
    template: `
      <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));">
        <AssociationEntry
          v-for="association in associations"
          :key="association.id"
          :association="association"
          :field-headers="args.fieldHeaders"
        />
      </div>
    `
  })
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AssociationForm from './AssociationForm.vue'

const meta = {
  title: 'Features/Associations/SaveAssociation/AssociationForm',
  component: AssociationForm,
  args: {
    title: 'Verein hinzufügen'
  },
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof AssociationForm>

export default meta

type Story = StoryObj<typeof meta>

export const Create: Story = {
  args: {
    title: 'Verein hinzufügen'
  },
  render: (args) => ({
    components: { AssociationForm },
    setup() {
      return { args }
    },
    template: `
      <div style="max-width: 48rem;">
        <AssociationForm v-bind="args" />
      </div>
    `
  })
}

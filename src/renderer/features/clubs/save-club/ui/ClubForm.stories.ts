import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ClubForm from './ClubForm.vue'

const meta = {
  title: 'Features/Clubs/SaveClub/ClubForm',
  component: ClubForm,
  args: {
    title: 'Verein hinzufügen'
  },
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof ClubForm>

export default meta

type Story = StoryObj<typeof meta>

export const Create: Story = {
  args: {
    title: 'Verein hinzufügen'
  },
  render: (args) => ({
    components: { ClubForm },
    setup() {
      return { args }
    },
    template: `
      <div style="max-width: 48rem;">
        <ClubForm v-bind="args" />
      </div>
    `
  })
}

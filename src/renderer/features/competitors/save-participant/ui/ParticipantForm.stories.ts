import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantForm from './ParticipantForm.vue'

const meta = {
  title: 'Features/Competitors/SaveParticipant/ParticipantForm',
  component: ParticipantForm,
  parameters: {
    layout: 'padded'
  },
  render: () => ({
    components: { ParticipantForm },
    template: `
      <div style="max-width: 640px; margin: 0 auto;">
        <ParticipantForm />
      </div>
    `
  })
} satisfies Meta<typeof ParticipantForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

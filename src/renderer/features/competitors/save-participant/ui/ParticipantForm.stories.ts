import { onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantForm from './ParticipantForm.vue'

const meta = {
  title: 'Features/Competitors/SaveParticipant/ParticipantForm',
  component: ParticipantForm,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof ParticipantForm>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  render: () => ({
    components: { ParticipantForm },
    template: `
      <div style="max-width: 640px; margin: 0 auto;">
        <ParticipantForm />
      </div>
    `
  })
}

export const Mobile: Story = {
  render: () => ({
    components: { ParticipantForm },
    setup() {
      onMounted(() => {
        Object.defineProperty(window, 'innerWidth', {
          configurable: true,
          value: 390
        })
        window.dispatchEvent(new Event('resize'))
      })
    },
    template: `
      <div style="max-width: 390px; margin: 0 auto;">
        <ParticipantForm />
      </div>
    `
  })
}

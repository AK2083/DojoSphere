import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantFormPage from './ParticipantFormPage.vue'

const meta = {
  title: 'Pages/ParticipantForm/ParticipantFormPage',
  component: ParticipantFormPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ParticipantFormPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

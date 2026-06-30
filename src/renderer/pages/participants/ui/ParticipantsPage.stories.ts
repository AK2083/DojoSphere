import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantsPage from './ParticipantsPage.vue'

const meta = {
  title: 'Pages/Participants/ParticipantsPage',
  component: ParticipantsPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ParticipantsPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ClubFormPage from './ClubFormPage.vue'

const meta = {
  title: 'Pages/Clubs/ClubFormPage',
  component: ClubFormPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ClubFormPage>

export default meta

type Story = StoryObj<typeof meta>

export const Create: Story = {}

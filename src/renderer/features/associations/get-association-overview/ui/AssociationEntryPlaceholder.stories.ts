import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ClubEntryPlaceholder from './ClubEntryPlaceholder.vue'

const meta = {
  title: 'Features/Clubs/GetClubOverview/ClubEntryPlaceholder',
  component: ClubEntryPlaceholder,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof ClubEntryPlaceholder>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

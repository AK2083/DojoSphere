import { onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ClubOverviewActions from './ClubOverviewActions.vue'

const meta = {
  title: 'Features/Clubs/GetClubOverview/ClubOverviewActions',
  component: ClubOverviewActions,
  parameters: {
    layout: 'padded'
  },
  args: {
    addLabel: 'Add club',
    isMobile: false
  }
} satisfies Meta<typeof ClubOverviewActions>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  render: (args) => ({
    components: { ClubOverviewActions },
    setup() {
      return { args }
    },
    template: `
      <div style="max-width: 48rem;">
        <ClubOverviewActions v-bind="args" />
      </div>
    `
  })
}

export const Mobile: Story = {
  args: {
    isMobile: true
  },
  render: (args) => ({
    components: { ClubOverviewActions },
    setup() {
      onMounted(() => {
        Object.defineProperty(window, 'innerWidth', {
          configurable: true,
          value: 390
        })
        window.dispatchEvent(new Event('resize'))
      })

      return { args }
    },
    template: `
      <div style="max-width: 390px;">
        <ClubOverviewActions v-bind="args" />
      </div>
    `
  })
}

import { onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AssociationOverviewActions from './AssociationOverviewActions.vue'

const meta = {
  title: 'Features/Associations/GetAssociationOverview/AssociationOverviewActions',
  component: AssociationOverviewActions,
  parameters: {
    layout: 'padded'
  },
  args: {
    addLabel: 'Add association',
    isMobile: false
  }
} satisfies Meta<typeof AssociationOverviewActions>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  render: (args) => ({
    components: { AssociationOverviewActions },
    setup() {
      return { args }
    },
    template: `
      <div style="max-width: 48rem;">
        <AssociationOverviewActions v-bind="args" />
      </div>
    `
  })
}

export const Mobile: Story = {
  args: {
    isMobile: true
  },
  render: (args) => ({
    components: { AssociationOverviewActions },
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
        <AssociationOverviewActions v-bind="args" />
      </div>
    `
  })
}

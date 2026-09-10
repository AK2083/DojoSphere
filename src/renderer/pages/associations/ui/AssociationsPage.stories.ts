import { onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AssociationsPage from './AssociationsPage.vue'

function setMobileViewport(): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 390
  })
  window.dispatchEvent(new Event('resize'))
}

const meta = {
  title: 'Pages/Associations/AssociationsPage',
  component: AssociationsPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AssociationsPage>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  render: () => ({
    components: { AssociationsPage },
    setup() {
      onMounted(() => {
        setMobileViewport()
      })
    },
    template: '<AssociationsPage />'
  })
}

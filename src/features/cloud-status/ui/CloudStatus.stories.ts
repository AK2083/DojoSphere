import type { Meta, StoryObj } from '@storybook/vue3-vite'

import CloudStatus from './CloudStatus.vue'

const meta = {
  title: 'Features/CloudStatus/CloudStatus',
  component: CloudStatus,
  parameters: {
    layout: 'fullscreen'
  },
  render: () => ({
    components: { CloudStatus },
    template: `
      <v-container class="fill-height">
        <v-row class="fill-height align-center justify-center">
          <CloudStatus />
        </v-row>
      </v-container>
    `
  })
} satisfies Meta<typeof CloudStatus>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const chip = canvasElement.querySelector('[data-testid="cloud-status-chip"]')

    if (!(chip instanceof globalThis.HTMLElement)) {
      throw new Error('Cloud status chip not found.')
    }

    const initialText = chip.textContent
    chip.click()

    await new Promise((resolve) => globalThis.setTimeout(resolve, 0))

    const updatedChip = canvasElement.querySelector('[data-testid="cloud-status-chip"]')
    const updatedText = updatedChip?.textContent

    if (initialText === updatedText) {
      throw new Error('Expected cloud status text to change after click.')
    }
  }
}

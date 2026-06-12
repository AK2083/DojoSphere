import type { Meta, StoryObj } from '@storybook/vue3-vite'

import SaveLocation from './SaveLocation.vue'

const meta = {
  title: 'Pages/Data Source/SaveLocation',
  component: SaveLocation,
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false
          }
        ]
      }
    }
  }
} satisfies Meta<typeof SaveLocation>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Settings from './Settings.vue'

const meta = {
  title: 'Pages/Settings/Settings',
  component: Settings,
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-valid-attr-value',
            enabled: false
          },
          {
            id: 'color-contrast',
            enabled: false
          }
        ]
      }
    }
  }
} satisfies Meta<typeof Settings>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

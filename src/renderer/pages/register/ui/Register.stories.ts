import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Register from './Register.vue'

const meta = {
  title: 'Pages/Register/Register',
  component: Register,
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
} satisfies Meta<typeof Register>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

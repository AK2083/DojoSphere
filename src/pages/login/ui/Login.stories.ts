import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Login from './Login.vue'

const meta = {
  title: 'Pages/Login/Login',
  component: Login,
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
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

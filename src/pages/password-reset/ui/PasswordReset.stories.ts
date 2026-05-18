import type { Meta, StoryObj } from '@storybook/vue3-vite'

import PasswordReset from './PasswordReset.vue'

const meta = {
  title: 'Pages/Password Reset/PasswordReset',
  component: PasswordReset,
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
} satisfies Meta<typeof PasswordReset>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

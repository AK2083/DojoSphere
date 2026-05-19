import type { Meta, StoryObj } from '@storybook/vue3-vite'

import EMailConfirmation from './EMailConfirmation.vue'

const meta = {
  title: 'Pages/Email Verification/EMailConfirmation',
  component: EMailConfirmation,
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
} satisfies Meta<typeof EMailConfirmation>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

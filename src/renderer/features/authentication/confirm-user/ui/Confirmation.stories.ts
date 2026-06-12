import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Confirmation from './Confirmation.vue'

const meta = {
  title: 'Features/Authentication/ConfirmUser/Confirmation',
  component: Confirmation,
  parameters: {
    layout: 'fullscreen'
  },
  render: () => ({
    components: { Confirmation },
    template: `
      <v-container
        class="fill-height d-flex align-center justify-center"
        style="min-height: 520px; background: rgb(var(--v-theme-background));"
      >
        <Confirmation />
      </v-container>
    `
  })
} satisfies Meta<typeof Confirmation>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ThemeToggle from './ThemeToggle.vue'

const meta = {
  title: 'Features/Settings/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'fullscreen'
  },
  render: () => ({
    components: { ThemeToggle },
    template: `
      <v-container>
        <v-row>
          <ThemeToggle />
        </v-row>
      </v-container>
    `
  })
} satisfies Meta<typeof ThemeToggle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

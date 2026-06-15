import type { Meta, StoryObj } from '@storybook/vue3-vite'

import LanguageSwitch from './LanguageSwitch.vue'

const meta = {
  title: 'Features/Settings/SetLanguage/LanguageSwitch',
  component: LanguageSwitch,
  parameters: {
    layout: 'fullscreen'
  },
  render: () => ({
    components: { LanguageSwitch },
    template: `
      <v-container>
        <v-row>
          <LanguageSwitch />
        </v-row>
      </v-container>
    `
  })
} satisfies Meta<typeof LanguageSwitch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

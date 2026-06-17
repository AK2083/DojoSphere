import { installPlaywrightBrowserElectronApi } from '@shared/lib/electron/e2e-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import UsernameEditor from './UsernameEditor.vue'

const meta = {
  title: 'Features/Settings/SetUsername/UsernameEditor',
  component: UsernameEditor,
  parameters: {
    layout: 'fullscreen'
  },
  loaders: [
    async () => {
      installPlaywrightBrowserElectronApi()
      return {}
    }
  ],
  render: () => ({
    components: { UsernameEditor },
    template: `
      <v-container>
        <v-row>
          <UsernameEditor />
        </v-row>
      </v-container>
    `
  })
} satisfies Meta<typeof UsernameEditor>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

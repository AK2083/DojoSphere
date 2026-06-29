import type { Meta, StoryObj } from '@storybook/vue3-vite'

import DiagnosticsUploadSettings from './DiagnosticsUploadSettings.vue'

const meta = {
  title: 'Features/Settings/ManageDiagnosticsUpload/DiagnosticsUploadSettings',
  component: DiagnosticsUploadSettings,
  parameters: {
    layout: 'fullscreen'
  },
  render: (args) => ({
    components: { DiagnosticsUploadSettings },
    setup() {
      return { args }
    },
    template: `
      <v-container>
        <v-row>
          <DiagnosticsUploadSettings v-bind="args" />
        </v-row>
      </v-container>
    `
  })
} satisfies Meta<typeof DiagnosticsUploadSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    autoUploadDiagnostics: false
  }
}

export const Enabled: Story = {
  args: {
    autoUploadDiagnostics: true
  }
}

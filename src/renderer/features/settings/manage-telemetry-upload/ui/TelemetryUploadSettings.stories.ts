import type { Meta, StoryObj } from '@storybook/vue3-vite'

import TelemetryUploadSettings from './TelemetryUploadSettings.vue'

const meta = {
  title: 'Features/Settings/ManageTelemetryUpload/TelemetryUploadSettings',
  component: TelemetryUploadSettings,
  parameters: {
    layout: 'fullscreen'
  },
  render: (args) => ({
    components: { TelemetryUploadSettings },
    setup() {
      return { args }
    },
    template: `
      <v-container>
        <v-row>
          <TelemetryUploadSettings v-bind="args" />
        </v-row>
      </v-container>
    `
  })
} satisfies Meta<typeof TelemetryUploadSettings>

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

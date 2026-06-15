import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Navigation from './Navigation.vue'

const meta = {
  title: 'Widgets/Navigation/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Navigation>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const hasClick = (element: unknown): element is { click: () => void } =>
      typeof (element as { click?: unknown })?.click === 'function'

    const nav = canvasElement.querySelector(
      '[role="navigation"][aria-label="Authentication"], [role="navigation"][aria-label="Authentifizierung"]'
    )

    if (!nav) {
      throw new Error('Navigation landmark not found.')
    }

    const settingsControl = canvasElement.querySelector(
      '[aria-label="Settings"], [aria-label="Einstellungen"], a[href$="#/settings"]'
    )

    if (!settingsControl) {
      throw new Error('Settings control not found.')
    }

    if (!hasClick(settingsControl)) {
      throw new Error('Settings control is not an HTML element.')
    }

    settingsControl.click()
  }
}

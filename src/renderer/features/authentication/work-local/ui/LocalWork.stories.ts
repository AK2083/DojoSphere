import { installPlaywrightBrowserElectronApi } from '@shared/lib/electron/e2e-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import LocalWork from './LocalWork.vue'

installPlaywrightBrowserElectronApi()

const meta = {
  title: 'Features/Authentication/WorkLocal/LocalWork',
  component: LocalWork,
  parameters: {
    layout: 'fullscreen'
  },
  render: () => ({
    components: { LocalWork },
    template: `
      <v-container class="fill-height">
        <v-row class="fill-height align-center justify-center">
          <v-col cols="12" md="8" lg="6">
            <LocalWork />
          </v-col>
        </v-row>
      </v-container>
    `
  })
} satisfies Meta<typeof LocalWork>

export default meta

type Story = StoryObj<typeof meta>

function getDisplayNameInput(canvasElement: globalThis.HTMLElement): globalThis.HTMLInputElement {
  const input = canvasElement.querySelector('#local-work-display-name')

  if (!(input instanceof globalThis.HTMLInputElement)) {
    throw new Error('Display name input not found.')
  }

  return input
}

function getValidationMessage(canvasElement: globalThis.HTMLElement): string | null {
  return canvasElement.querySelector('.v-messages__message')?.textContent ?? null
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => globalThis.setTimeout(resolve, 0))

    const input = getDisplayNameInput(canvasElement)

    if (input.value !== 'TestUser') {
      throw new Error(`Expected prefilled OS username "TestUser", got "${input.value}".`)
    }
  }
}

export const EmptyDisplayName: Story = {
  decorators: [
    (story) => {
      installPlaywrightBrowserElectronApi({ getOsUsername: async () => '' })
      return story()
    }
  ],
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => globalThis.setTimeout(resolve, 0))

    const input = getDisplayNameInput(canvasElement)
    input.focus()
    input.blur()

    await new Promise((resolve) => globalThis.setTimeout(resolve, 0))

    const message = getValidationMessage(canvasElement)

    if (message !== 'Please enter a name.') {
      throw new Error(`Expected required validation message, got "${message}".`)
    }
  }
}

export const DisplayNameTooShort: Story = {
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => globalThis.setTimeout(resolve, 0))

    const input = getDisplayNameInput(canvasElement)
    input.value = 'ab'
    input.dispatchEvent(new globalThis.Event('input', { bubbles: true }))
    input.blur()

    await new Promise((resolve) => globalThis.setTimeout(resolve, 0))

    const message = getValidationMessage(canvasElement)

    if (message !== 'The name must contain at least 3 letters.') {
      throw new Error(`Expected min-letters validation message, got "${message}".`)
    }
  }
}

export const ValidDisplayName: Story = {
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => globalThis.setTimeout(resolve, 0))

    const input = getDisplayNameInput(canvasElement)
    input.value = 'Ada'
    input.dispatchEvent(new globalThis.Event('input', { bubbles: true }))
    input.blur()

    await new Promise((resolve) => globalThis.setTimeout(resolve, 0))

    const message = getValidationMessage(canvasElement)

    if (message) {
      throw new Error(`Expected no validation message, got "${message}".`)
    }
  }
}

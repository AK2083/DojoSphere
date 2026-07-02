import { onMounted } from 'vue'
import type { Decorator, Meta, StoryObj } from '@storybook/vue3-vite'

import {
  installStorybookParticipantApi,
  installStorybookParticipantApiError,
  installStorybookParticipantApiLoading,
  resetStorybookParticipantApi
} from './participant-overview-story-fixtures'
import ParticipantOverviewSection from './ParticipantOverviewSection.vue'

type ParticipantApiMode = 'populated' | 'empty' | 'loading' | 'error'

const withParticipantApi: Decorator = (story, { parameters }) => {
  resetStorybookParticipantApi()

  const mode = (parameters.participantApi as ParticipantApiMode | undefined) ?? 'populated'

  if (mode === 'error') {
    installStorybookParticipantApiError()
  } else if (mode === 'loading') {
    installStorybookParticipantApiLoading()
  } else if (mode === 'empty') {
    installStorybookParticipantApi([])
  } else {
    installStorybookParticipantApi()
  }

  return story()
}

const meta = {
  title: 'Features/Competitors/GetParticipantOverview/ParticipantOverviewSection',
  component: ParticipantOverviewSection,
  decorators: [withParticipantApi],
  parameters: {
    layout: 'padded',
    participantApi: 'populated'
  },
  render: () => ({
    components: { ParticipantOverviewSection },
    template: `
      <div style="width: min(100%, 64rem);">
        <ParticipantOverviewSection />
      </div>
    `
  })
} satisfies Meta<typeof ParticipantOverviewSection>

export default meta

type Story = StoryObj<typeof meta>

export const Populated: Story = {
  parameters: {
    participantApi: 'populated'
  }
}

export const Empty: Story = {
  parameters: {
    participantApi: 'empty'
  }
}

export const Loading: Story = {
  parameters: {
    participantApi: 'loading'
  }
}

export const LoadError: Story = {
  parameters: {
    participantApi: 'error'
  }
}

export const Mobile: Story = {
  parameters: {
    participantApi: 'populated'
  },
  render: () => ({
    components: { ParticipantOverviewSection },
    setup() {
      onMounted(() => {
        Object.defineProperty(window, 'innerWidth', {
          configurable: true,
          value: 390
        })
        window.dispatchEvent(new Event('resize'))
      })
    },
    template: `
      <div style="max-width: 390px;">
        <ParticipantOverviewSection />
      </div>
    `
  })
}

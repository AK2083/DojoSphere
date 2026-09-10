import { onMounted } from 'vue'
import type { Decorator, Meta, StoryObj } from '@storybook/vue3-vite'

import {
  installStorybookClubsLoader,
  installStorybookClubsLoaderError,
  installStorybookClubsLoaderLoading,
  resetStorybookClubsLoader
} from './club-overview-story-fixtures'
import ClubOverviewSection from './ClubOverviewSection.vue'

type ClubsLoaderMode = 'populated' | 'empty' | 'loading' | 'error'

const withClubsLoader: Decorator = (story, { parameters }) => {
  resetStorybookClubsLoader()

  const mode = (parameters.clubsLoader as ClubsLoaderMode | undefined) ?? 'populated'

  if (mode === 'error') {
    installStorybookClubsLoaderError()
  } else if (mode === 'loading') {
    installStorybookClubsLoaderLoading()
  } else if (mode === 'empty') {
    installStorybookClubsLoader([])
  } else {
    installStorybookClubsLoader()
  }

  return story()
}

const meta = {
  title: 'Features/Clubs/GetClubOverview/ClubOverviewSection',
  component: ClubOverviewSection,
  decorators: [withClubsLoader],
  parameters: {
    layout: 'padded',
    clubsLoader: 'populated'
  },
  render: () => ({
    components: { ClubOverviewSection },
    template: `
      <div style="width: min(100%, 64rem);">
        <ClubOverviewSection />
      </div>
    `
  })
} satisfies Meta<typeof ClubOverviewSection>

export default meta

type Story = StoryObj<typeof meta>

export const Populated: Story = {
  parameters: {
    clubsLoader: 'populated'
  }
}

export const Empty: Story = {
  parameters: {
    clubsLoader: 'empty'
  }
}

export const Loading: Story = {
  parameters: {
    clubsLoader: 'loading'
  }
}

export const LoadError: Story = {
  parameters: {
    clubsLoader: 'error'
  }
}

export const Mobile: Story = {
  parameters: {
    clubsLoader: 'populated'
  },
  render: () => ({
    components: { ClubOverviewSection },
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
        <ClubOverviewSection />
      </div>
    `
  })
}

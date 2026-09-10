import { onMounted } from 'vue'
import type { Decorator, Meta, StoryObj } from '@storybook/vue3-vite'

import {
  installStorybookAssociationsLoader,
  installStorybookAssociationsLoaderError,
  installStorybookAssociationsLoaderLoading,
  resetStorybookAssociationsLoader
} from './association-overview-story-fixtures'
import AssociationOverviewSection from './AssociationOverviewSection.vue'

type AssociationsLoaderMode = 'populated' | 'empty' | 'loading' | 'error'

const withAssociationsLoader: Decorator = (story, { parameters }) => {
  resetStorybookAssociationsLoader()

  const mode = (parameters.associationsLoader as AssociationsLoaderMode | undefined) ?? 'populated'

  if (mode === 'error') {
    installStorybookAssociationsLoaderError()
  } else if (mode === 'loading') {
    installStorybookAssociationsLoaderLoading()
  } else if (mode === 'empty') {
    installStorybookAssociationsLoader([])
  } else {
    installStorybookAssociationsLoader()
  }

  return story()
}

const meta = {
  title: 'Features/Associations/GetAssociationOverview/AssociationOverviewSection',
  component: AssociationOverviewSection,
  decorators: [withAssociationsLoader],
  parameters: {
    layout: 'padded',
    associationsLoader: 'populated'
  },
  render: () => ({
    components: { AssociationOverviewSection },
    template: `
      <div style="width: min(100%, 64rem);">
        <AssociationOverviewSection />
      </div>
    `
  })
} satisfies Meta<typeof AssociationOverviewSection>

export default meta

type Story = StoryObj<typeof meta>

export const Populated: Story = {
  parameters: {
    associationsLoader: 'populated'
  }
}

export const Empty: Story = {
  parameters: {
    associationsLoader: 'empty'
  }
}

export const Loading: Story = {
  parameters: {
    associationsLoader: 'loading'
  }
}

export const LoadError: Story = {
  parameters: {
    associationsLoader: 'error'
  }
}

export const Mobile: Story = {
  parameters: {
    associationsLoader: 'populated'
  },
  render: () => ({
    components: { AssociationOverviewSection },
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
        <AssociationOverviewSection />
      </div>
    `
  })
}

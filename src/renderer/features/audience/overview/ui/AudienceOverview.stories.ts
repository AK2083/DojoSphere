import { audienceEn } from '@features/audience'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AudienceOverview from './AudienceOverview.vue'

const meta = {
  title: 'Features/Audience/AudienceOverview',
  component: AudienceOverview,
  parameters: {
    i18n: {
      locale: 'en',
      messages: {
        en: {
          audience: audienceEn
        }
      }
    }
  }
} satisfies Meta<typeof AudienceOverview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AssociationFormPage from './AssociationFormPage.vue'

const meta = {
  title: 'Pages/Associations/AssociationFormPage',
  component: AssociationFormPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AssociationFormPage>

export default meta

type Story = StoryObj<typeof meta>

export const Create: Story = {}

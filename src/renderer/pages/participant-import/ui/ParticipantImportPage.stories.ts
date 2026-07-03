import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantImportPage from './ParticipantImportPage.vue'

const meta = {
  title: 'Pages/ParticipantImport/ParticipantImportPage',
  component: ParticipantImportPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ParticipantImportPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { ParticipantImportPage },
    setup() {
      const router = useRouter()

      onMounted(async () => {
        await router.push({ name: 'participant-import' })
      })
    },
    template: '<ParticipantImportPage />'
  })
}

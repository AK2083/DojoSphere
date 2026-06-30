import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ParticipantFormPage from './ParticipantFormPage.vue'

const meta = {
  title: 'Pages/ParticipantForm/ParticipantFormPage',
  component: ParticipantFormPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ParticipantFormPage>

export default meta

type Story = StoryObj<typeof meta>

function renderWithRoute(routeName: 'participant-create' | 'participant-edit', id?: string) {
  return () => ({
    components: { ParticipantFormPage },
    setup() {
      const router = useRouter()

      onMounted(async () => {
        if (routeName === 'participant-edit') {
          await router.push({ name: routeName, params: { id: id ?? 'participant-1' } })
          return
        }

        await router.push({ name: routeName })
      })
    },
    template: '<ParticipantFormPage />'
  })
}

function setMobileViewport(): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 390
  })
  window.dispatchEvent(new Event('resize'))
}

export const Create: Story = {
  render: renderWithRoute('participant-create')
}

export const Edit: Story = {
  render: renderWithRoute('participant-edit', 'participant-1')
}

export const CreateMobile: Story = {
  render: () => ({
    components: { ParticipantFormPage },
    setup() {
      const router = useRouter()

      onMounted(async () => {
        setMobileViewport()
        await router.push({ name: 'participant-create' })
      })
    },
    template: '<ParticipantFormPage />'
  })
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import RegisterForm from './RegisterForm.vue'

const meta = {
  title: 'Features/Authentication/RegisterUser/RegisterForm',
  component: RegisterForm,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof RegisterForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

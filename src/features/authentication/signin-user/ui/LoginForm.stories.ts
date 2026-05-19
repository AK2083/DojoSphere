import type { Meta, StoryObj } from '@storybook/vue3-vite'

import LoginForm from './LoginForm.vue'

const meta = {
  title: 'Features/Authentication/SigninUser/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof LoginForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

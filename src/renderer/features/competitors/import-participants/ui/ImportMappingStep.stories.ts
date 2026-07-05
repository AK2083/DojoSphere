import { defineComponent, h } from 'vue'
import type { ImportPreviewResult } from '@shared/types/electron-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { provideParticipantImport } from '../model/use-participant-import'
import ImportMappingStep from './ImportMappingStep.vue'

const STORY_PREVIEW: ImportPreviewResult = {
  columns: [
    { id: 'sheet1::0', sheetName: 'Teilnehmer', header: 'Vorname', sampleValues: ['Yuki', 'Anna'] },
    {
      id: 'sheet1::1',
      sheetName: 'Teilnehmer',
      header: 'Nachname',
      sampleValues: ['Tanaka', 'Weber']
    },
    { id: 'sheet1::2', sheetName: 'Teilnehmer', header: 'Verein', sampleValues: ['Dojo Nord'] },
    { id: 'sheet1::3', sheetName: 'Teilnehmer', header: 'Gewicht', sampleValues: ['52', '48'] },
    {
      id: 'sheet1::4',
      sheetName: 'Teilnehmer',
      header: 'Jahrgang',
      sampleValues: ['2012', '2011']
    },
    {
      id: 'sheet1::5',
      sheetName: 'Teilnehmer',
      header: 'Pass.-Nr.',
      sampleValues: ['JP-001', 'JP-002']
    }
  ],
  fields: [
    { key: 'givenName', required: true },
    { key: 'familyName', required: true },
    { key: 'club', required: false },
    { key: 'weightKg', required: false },
    { key: 'birthDate', required: false },
    { key: 'passNumber', required: false }
  ],
  suggestedMapping: {
    givenName: 'sheet1::0',
    familyName: 'sheet1::1',
    club: 'sheet1::2',
    weightKg: 'sheet1::3',
    birthDate: 'sheet1::4',
    passNumber: 'sheet1::5'
  },
  sources: {
    givenName: 'header',
    familyName: 'header',
    club: 'header',
    weightKg: 'header',
    birthDate: 'header',
    passNumber: 'header'
  },
  mappingValid: true,
  missingRequiredFields: [],
  rowCount: 24
}

const ImportStoryHarness = defineComponent({
  name: 'ImportStoryHarness',
  setup(_, { slots }) {
    const controller = provideParticipantImport()

    controller.preview.value = STORY_PREVIEW
    controller.mapping.value = { ...STORY_PREVIEW.suggestedMapping }
    controller.sources.value = { ...STORY_PREVIEW.sources }

    return () => h('div', slots.default?.())
  }
})

const meta = {
  title: 'Features/Competitors/ImportParticipants/ImportMappingStep',
  component: ImportMappingStep,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof ImportMappingStep>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { ImportMappingStep, ImportStoryHarness },
    template: `
      <v-card variant="outlined" max-width="40rem" class="pa-4">
        <ImportStoryHarness>
          <ImportMappingStep />
        </ImportStoryHarness>
      </v-card>
    `
  })
}

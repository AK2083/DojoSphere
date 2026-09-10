import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { ASSOCIATION_MOCK_DATA } from '../../get-association-overview/model/association-mock-data'
import { useAssociationsStore } from '../../store/use-associations-store'
import { createAssociation, loadAssociation, updateAssociation } from './save-association'

describe('save-association service', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useAssociationsStore().resetAssociations()
  })

  it('loads, creates, and updates associations through the store', async () => {
    const existing = await loadAssociation(ASSOCIATION_MOCK_DATA[0]!.id)
    expect(existing.name).toBe('Judoclub Nord e.V.')

    await createAssociation({
      ...ASSOCIATION_MOCK_DATA[0]!,
      id: 'created-association',
      name: 'Created Association'
    })
    expect((await loadAssociation('created-association')).name).toBe('Created Association')

    await updateAssociation({
      ...ASSOCIATION_MOCK_DATA[0]!,
      id: 'created-association',
      name: 'Updated Association'
    })
    expect((await loadAssociation('created-association')).name).toBe('Updated Association')
  })

  it('throws when loading or updating a missing association', async () => {
    await expect(loadAssociation('missing')).rejects.toThrow('Association not found: missing')
    await expect(
      updateAssociation({
        ...ASSOCIATION_MOCK_DATA[0]!,
        id: 'missing'
      })
    ).rejects.toThrow('Association not found: missing')
  })
})

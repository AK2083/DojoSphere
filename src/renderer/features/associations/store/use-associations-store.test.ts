import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { ASSOCIATION_MOCK_DATA } from '../get-association-overview/model/association-mock-data'
import { useAssociationsStore } from './use-associations-store'

describe('useAssociationsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useAssociationsStore().resetAssociations()
  })

  it('seeds associations from the mock fixtures', () => {
    const store = useAssociationsStore()

    expect(store.listAssociations()).toEqual(ASSOCIATION_MOCK_DATA)
  })

  it('creates, updates, and deletes associations', () => {
    const store = useAssociationsStore()
    const created = {
      ...ASSOCIATION_MOCK_DATA[0]!,
      id: 'new-association',
      name: 'New Association'
    }

    store.createAssociation(created)
    expect(store.getAssociationById('new-association')?.name).toBe('New Association')

    store.updateAssociation({
      ...created,
      name: 'Updated Association'
    })
    expect(store.getAssociationById('new-association')?.name).toBe('Updated Association')

    expect(store.deleteAssociation('new-association')).toBe(true)
    expect(store.getAssociationById('new-association')).toBeUndefined()
    expect(store.deleteAssociation('missing')).toBe(false)
  })

  it('returns false when updating a missing association', () => {
    const store = useAssociationsStore()

    expect(
      store.updateAssociation({
        ...ASSOCIATION_MOCK_DATA[0]!,
        id: 'missing'
      })
    ).toBe(false)
  })

  it('exposes newest-first associations through a getter', () => {
    const store = useAssociationsStore()
    const ids = store.associationsNewestFirst.map((association) => association.id)

    expect(ids[0]).toBe(ASSOCIATION_MOCK_DATA[0]!.id)
  })
})

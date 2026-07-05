import { beforeEach, describe, expect, it, vi } from 'vitest'

const fuseSearch = vi.hoisted(() => vi.fn())

vi.mock('fuse.js', () => ({
  default: class FuseMock {
    search = fuseSearch
  }
}))

describe('matchColumns fuse scoring', () => {
  beforeEach(() => {
    fuseSearch.mockReset()
    fuseSearch.mockReturnValue([{ item: { field: 'remarks' }, score: undefined }])
  })

  it('treats fuse matches without a score as zero similarity', async () => {
    const { matchColumns } = await import('./match-columns')

    const result = matchColumns({
      sheetNames: ['Sheet1'],
      columns: [
        {
          id: 'Sheet1#0',
          sheetName: 'Sheet1',
          columnIndex: 0,
          header: 'Bemerkungstext',
          values: ['Hinweis']
        },
        {
          id: 'Sheet1#1',
          sheetName: 'Sheet1',
          columnIndex: 1,
          header: 'Vorname',
          values: ['Lina']
        },
        {
          id: 'Sheet1#2',
          sheetName: 'Sheet1',
          columnIndex: 2,
          header: 'Nachname',
          values: ['Bauer']
        }
      ],
      formFields: []
    })

    expect(result.mapping.givenName).toBe('Sheet1#1')
    expect(fuseSearch).toHaveBeenCalled()
  })
})

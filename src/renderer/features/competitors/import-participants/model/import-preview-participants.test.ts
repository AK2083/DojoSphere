import { describe, expect, it } from 'vitest'

import { IMPORT_PREVIEW_PARTICIPANTS } from './import-preview-participants'

describe('import-preview-participants', () => {
  it('provides fictional preview rows with success flags', () => {
    expect(IMPORT_PREVIEW_PARTICIPANTS).toHaveLength(5)
    expect(IMPORT_PREVIEW_PARTICIPANTS.some((participant) => participant.success)).toBe(true)
    expect(IMPORT_PREVIEW_PARTICIPANTS.some((participant) => !participant.success)).toBe(true)
  })
})

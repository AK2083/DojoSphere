import type {
  Association,
  AssociationAddress,
  AssociationContact,
  AssociationIdentifier
} from '@shared/types/electron-api'

/**
 * Association row shaped for the associations overview cards.
 *
 * Mirrors the SQLite association hierarchy and child tables returned via IPC.
 */
export type AssociationOverviewRow = Association

export type { AssociationAddress, AssociationContact, AssociationIdentifier }

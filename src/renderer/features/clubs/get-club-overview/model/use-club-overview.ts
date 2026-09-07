import { computed, onMounted, ref } from 'vue'
import { logError, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { loadClubs } from '../service/load-clubs'
import type { ClubOverviewRow } from './club-row'

/**
 *
 */
export type ClubFieldHeader = {
  title: string
  key: string
}

/**
 * Overview item with translated status label for display.
 */
export type ClubOverviewItem = Omit<ClubOverviewRow, 'isActive'> & {
  isActive: boolean
  statusLabel: string
}

function sortByNewestFirst(rows: ClubOverviewRow[]): ClubOverviewRow[] {
  return [...rows].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

/**
 * UI state for the club overview loaded from mock fixtures.
 *
 * Add/edit are stubs until forms and SQLite wiring land in later issues.
 * Delete removes the row from in-memory state only.
 *
 * @returns Reactive list state and action handlers for the club overview.
 */
export function useClubOverview() {
  const { t } = useTranslation()
  const loading = ref(true)
  const loadErrorMessage = ref('')
  const stubMessage = ref('')
  const clubs = ref<ClubOverviewRow[]>([])

  const fieldHeaders = computed<ClubFieldHeader[]>(() => [
    { title: t(translationKeys.list.columns.city), key: 'city' },
    { title: t(translationKeys.list.columns.website), key: 'website' },
    { title: t(translationKeys.list.columns.status), key: 'status' },
    { title: t(translationKeys.list.columns.district), key: 'district' },
    { title: t(translationKeys.list.columns.country), key: 'country' },
    { title: t(translationKeys.list.columns.association), key: 'association' },
    {
      title: t(translationKeys.list.columns.regionalAssociation),
      key: 'regionalAssociation'
    },
    { title: t(translationKeys.list.columns.clubNumber), key: 'clubNumber' },
    { title: t(translationKeys.list.columns.headquarters), key: 'headquarters' },
    { title: t(translationKeys.list.columns.trainingVenue), key: 'trainingVenue' },
    { title: t(translationKeys.list.columns.billingAddress), key: 'billingAddress' },
    { title: t(translationKeys.list.columns.email), key: 'email' },
    { title: t(translationKeys.list.columns.phone), key: 'phone' }
  ])

  const overviewItems = computed<ClubOverviewItem[]>(() =>
    sortByNewestFirst(clubs.value).map((club) => ({
      ...club,
      statusLabel: club.isActive
        ? t(translationKeys.status.active)
        : t(translationKeys.status.inactive)
    }))
  )

  async function refresh(): Promise<void> {
    loading.value = true
    loadErrorMessage.value = ''

    try {
      clubs.value = await loadClubs()
    } catch (error) {
      loadErrorMessage.value = t(translationKeys.loadError)
      logError(error as Error, 'clubs', 'load-clubs')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void refresh()
  })

  function showStubMessage(): void {
    stubMessage.value = t(translationKeys.stubUnavailable)
  }

  function clearStubMessage(): void {
    stubMessage.value = ''
  }

  function handleAdd(): void {
    showStubMessage()
  }

  function handleEdit(_club: ClubOverviewItem): void {
    showStubMessage()
  }

  function handleDelete(club: ClubOverviewItem): void {
    clubs.value = clubs.value.filter((entry) => entry.id !== club.id)
  }

  return {
    loading,
    loadErrorMessage,
    stubMessage,
    overviewItems,
    fieldHeaders,
    refresh,
    handleAdd,
    handleEdit,
    handleDelete,
    clearStubMessage
  }
}

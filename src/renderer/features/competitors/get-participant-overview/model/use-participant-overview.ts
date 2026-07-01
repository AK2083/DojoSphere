import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logError, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { deleteParticipant, loadParticipants } from '../service/load-participants'
import { mapCompetitorToRow } from './map-competitor-to-row'
import { type ParticipantGender, type ParticipantRow } from './participant-row'

const GENDER_TRANSLATION_KEY: Record<ParticipantGender, string> = {
  f: translationKeys.gender.female,
  m: translationKeys.gender.male,
  d: translationKeys.gender.diverse
}

type TableSortItem = {
  key: string
  order: 'asc' | 'desc'
}

/**
 *
 */
export type ParticipantTableSortItem = TableSortItem

/**
 *
 */
export type ParticipantOverviewHeader = {
  title: string
  key: string
  sortable: boolean
  minWidth?: string
  align?: 'end' | 'start' | 'center'
}

/**
 *
 */
export type ParticipantTableRow = Omit<ParticipantRow, 'gender'> & {
  gender: string
}

/**
 * UI state for the participant overview table loaded from the local database.
 *
 * @returns Reactive table state and CRUD handlers for the participant overview.
 */
export function useParticipantOverview() {
  const { t } = useTranslation()
  const router = useRouter()
  const loading = ref(true)
  const loadErrorMessage = ref('')
  const participants = ref<ParticipantRow[]>([])
  const sortBy = ref<TableSortItem[]>([{ key: 'familyName', order: 'asc' }])

  const headers = computed(() => [
    {
      title: t(translationKeys.table.columns.givenName),
      key: 'givenName',
      sortable: true,
      minWidth: '7rem'
    },
    {
      title: t(translationKeys.table.columns.familyName),
      key: 'familyName',
      sortable: true,
      minWidth: '7rem'
    },
    {
      title: t(translationKeys.table.columns.gender),
      key: 'gender',
      sortable: true,
      minWidth: '6rem'
    },
    {
      title: t(translationKeys.table.columns.birthDate),
      key: 'birthDate',
      sortable: true,
      minWidth: '8rem'
    },
    {
      title: t(translationKeys.table.columns.club),
      key: 'club',
      sortable: true,
      minWidth: '8rem'
    },
    {
      title: t(translationKeys.table.columns.nationality),
      key: 'nationality',
      sortable: true,
      minWidth: '5rem'
    },
    {
      title: t(translationKeys.table.columns.weightClass),
      key: 'weightClass',
      sortable: true,
      minWidth: '7rem'
    },
    {
      title: t(translationKeys.table.columns.ageClass),
      key: 'ageClass',
      sortable: true,
      minWidth: '6rem'
    },
    {
      title: t(translationKeys.table.columns.passNumber),
      key: 'passNumber',
      sortable: true,
      minWidth: '8rem'
    },
    {
      title: t(translationKeys.table.columns.grade),
      key: 'grade',
      sortable: true,
      minWidth: '6rem'
    },
    {
      title: t(translationKeys.table.columns.licenseNumber),
      key: 'licenseNumber',
      sortable: true,
      minWidth: '9rem'
    },
    {
      title: t(translationKeys.table.columns.clubContactEmail),
      key: 'clubContactEmail',
      sortable: true,
      minWidth: '12rem'
    },
    {
      title: t(translationKeys.table.columns.contactPhone),
      key: 'contactPhone',
      sortable: true,
      minWidth: '9rem'
    },
    {
      title: t(translationKeys.table.columns.coach),
      key: 'coach',
      sortable: true,
      minWidth: '8rem'
    },
    {
      title: t(translationKeys.table.columns.actions),
      key: 'actions',
      sortable: false,
      align: 'end' as const,
      minWidth: '6rem'
    }
  ])

  const tableItems = computed<ParticipantTableRow[]>(() =>
    participants.value.map((participant) => ({
      ...participant,
      gender: t(GENDER_TRANSLATION_KEY[participant.gender])
    }))
  )

  async function refresh(): Promise<void> {
    loading.value = true
    loadErrorMessage.value = ''

    try {
      const competitors = await loadParticipants()

      participants.value = competitors.map((competitor) => mapCompetitorToRow(competitor, t))
    } catch (error) {
      loadErrorMessage.value = t(translationKeys.loadError)
      logError(error as Error, 'competitors', 'load-participants')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void refresh()
  })

  function handleAdd(): void {
    void router.push({ name: 'participant-create' })
  }

  function handleEdit(participant: ParticipantTableRow): void {
    void router.push({
      name: 'participant-edit',
      params: { id: participant.id }
    })
  }

  async function handleDelete(participant: ParticipantTableRow): Promise<void> {
    try {
      await deleteParticipant(participant.id)
      await refresh()
    } catch (error) {
      loadErrorMessage.value = t(translationKeys.loadError)
      logError(error as Error, 'competitors', 'delete-participant')
    }
  }

  return {
    loading,
    loadErrorMessage,
    tableItems,
    headers,
    sortBy,
    refresh,
    handleAdd,
    handleEdit,
    handleDelete
  }
}

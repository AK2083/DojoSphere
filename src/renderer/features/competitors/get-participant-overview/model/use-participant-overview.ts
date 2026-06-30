import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import {
  type ParticipantGender,
  type ParticipantRow,
  STATIC_PARTICIPANTS
} from './static-participants'

const INITIAL_LOAD_DELAY_MS = 400

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
 * UI state for the participant overview table, including a simulated initial load.
 *
 * @returns Reactive table state and CRUD handlers for the UI prototype.
 */
export function useParticipantOverview() {
  const { t } = useTranslation()
  const router = useRouter()
  const loading = ref(true)
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
      gender: t(translationKeys.gender[participant.gender as ParticipantGender])
    }))
  )

  onMounted(() => {
    globalThis.setTimeout(() => {
      participants.value = [...STATIC_PARTICIPANTS]
      loading.value = false
    }, INITIAL_LOAD_DELAY_MS)
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

  function handleDelete(_participant: ParticipantTableRow): void {
    // UI placeholder until competitor delete flow is implemented.
  }

  return {
    loading,
    tableItems,
    headers,
    sortBy,
    handleAdd,
    handleEdit,
    handleDelete
  }
}

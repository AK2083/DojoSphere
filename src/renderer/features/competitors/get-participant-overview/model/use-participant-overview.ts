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

/**
 *
 */
export type ParticipantFieldHeader = {
  title: string
  key: string
}

/**
 *
 */
export type ParticipantOverviewItem = Omit<ParticipantRow, 'gender'> & {
  gender: string
}

function sortByNewestFirst(rows: ParticipantRow[]): ParticipantRow[] {
  return [...rows].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

/**
 * UI state for the participant overview loaded from the local database.
 *
 * @returns Reactive list state and CRUD handlers for the participant overview.
 */
export function useParticipantOverview() {
  const { t } = useTranslation()
  const router = useRouter()
  const loading = ref(true)
  const loadErrorMessage = ref('')
  const participants = ref<ParticipantRow[]>([])

  const fieldHeaders = computed<ParticipantFieldHeader[]>(() => [
    { title: t(translationKeys.list.columns.givenName), key: 'givenName' },
    { title: t(translationKeys.list.columns.familyName), key: 'familyName' },
    { title: t(translationKeys.list.columns.gender), key: 'gender' },
    { title: t(translationKeys.list.columns.birthDate), key: 'birthDate' },
    { title: t(translationKeys.list.columns.club), key: 'club' },
    { title: t(translationKeys.list.columns.nationality), key: 'nationality' },
    { title: t(translationKeys.list.columns.weightClass), key: 'weightClass' },
    { title: t(translationKeys.list.columns.ageClass), key: 'ageClass' },
    { title: t(translationKeys.list.columns.passNumber), key: 'passNumber' },
    { title: t(translationKeys.list.columns.grade), key: 'grade' },
    { title: t(translationKeys.list.columns.licenseNumber), key: 'licenseNumber' },
    { title: t(translationKeys.list.columns.clubContactEmail), key: 'clubContactEmail' },
    { title: t(translationKeys.list.columns.contactPhone), key: 'contactPhone' },
    { title: t(translationKeys.list.columns.coach), key: 'coach' }
  ])

  const overviewItems = computed<ParticipantOverviewItem[]>(() =>
    sortByNewestFirst(participants.value).map((participant) => ({
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

  function handleEdit(participant: ParticipantOverviewItem): void {
    void router.push({
      name: 'participant-edit',
      params: { id: participant.id }
    })
  }

  async function handleDelete(participant: ParticipantOverviewItem): Promise<void> {
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
    overviewItems,
    fieldHeaders,
    refresh,
    handleAdd,
    handleEdit,
    handleDelete
  }
}

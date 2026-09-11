import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logError, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { deleteAssociation, loadAssociations } from '../service/load-associations'
import type { AssociationOverviewRow } from './association-row'

/**
 *
 */
export type AssociationFieldHeader = {
  title: string
  key: string
}

/**
 * Overview item with translated status label for display.
 */
export type AssociationOverviewItem = Omit<AssociationOverviewRow, 'isActive'> & {
  isActive: boolean
  statusLabel: string
}

function sortByNewestFirst(rows: AssociationOverviewRow[]): AssociationOverviewRow[] {
  return [...rows].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

/**
 * UI state for the association overview loaded from the local database.
 *
 * @returns Reactive list state and action handlers for the association overview.
 */
export function useAssociationOverview() {
  const { t } = useTranslation()
  const router = useRouter()
  const loading = ref(true)
  const loadErrorMessage = ref('')
  const associations = ref<AssociationOverviewRow[]>([])

  const fieldHeaders = computed<AssociationFieldHeader[]>(() => [
    { title: t(translationKeys.list.columns.city), key: 'city' },
    { title: t(translationKeys.list.columns.website), key: 'website' },
    { title: t(translationKeys.list.columns.status), key: 'status' },
    { title: t(translationKeys.list.columns.country), key: 'country' },
    { title: t(translationKeys.list.columns.federation), key: 'association' },
    {
      title: t(translationKeys.list.columns.regionalFederation),
      key: 'regionalFederation'
    },
    { title: t(translationKeys.list.columns.associationNumber), key: 'associationNumber' },
    { title: t(translationKeys.list.columns.headquarters), key: 'headquarters' },
    { title: t(translationKeys.list.columns.trainingVenue), key: 'trainingVenue' },
    { title: t(translationKeys.list.columns.billingAddress), key: 'billingAddress' },
    { title: t(translationKeys.list.columns.email), key: 'email' },
    { title: t(translationKeys.list.columns.phone), key: 'phone' }
  ])

  const overviewItems = computed<AssociationOverviewItem[]>(() =>
    sortByNewestFirst(associations.value).map((association) => ({
      ...association,
      statusLabel: association.isActive
        ? t(translationKeys.status.active)
        : t(translationKeys.status.inactive)
    }))
  )

  async function refresh(): Promise<void> {
    loading.value = true
    loadErrorMessage.value = ''

    try {
      associations.value = await loadAssociations()
    } catch (error) {
      loadErrorMessage.value = t(translationKeys.loadError)
      logError(error as Error, 'associations', 'load-associations')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void refresh()
  })

  function handleAdd(): void {
    void router.push({ name: 'association-create' })
  }

  function handleEdit(association: AssociationOverviewItem): void {
    void router.push({
      name: 'association-edit',
      params: { id: association.id }
    })
  }

  async function handleDelete(association: AssociationOverviewItem): Promise<void> {
    try {
      await deleteAssociation(association.id)
      await refresh()
    } catch (error) {
      loadErrorMessage.value = t(translationKeys.loadError)
      logError(error as Error, 'associations', 'delete-association')
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

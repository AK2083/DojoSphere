import { computed, type MaybeRefOrGetter, onMounted, ref, toValue, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { VForm } from 'vuetify/components'
import { logError, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { mapClubFormRule } from '../lib/club-form-error-manager'
import {
  CLUB_CITY_MAX_LENGTH,
  CLUB_DISTRICT_MAX_LENGTH,
  CLUB_HOUSE_NUMBER_MAX_LENGTH,
  CLUB_NAME_MAX_LENGTH,
  CLUB_NUMBER_MAX_LENGTH,
  CLUB_PHONE_MAX_LENGTH,
  CLUB_POSTAL_CODE_LENGTH,
  CLUB_SHORT_NAME_MAX_LENGTH,
  CLUB_STREET_MAX_LENGTH,
  CLUB_WEBSITE_HOST_MAX_LENGTH,
  optionalCityRule,
  optionalClubNumberRule,
  optionalEmailRule,
  optionalGermanPostalCodeRule,
  optionalHouseNumberRule,
  optionalMaxLengthRule,
  optionalPhoneNumberRule,
  optionalWebsiteHostRule,
  requiredMaxLengthRule
} from '../lib/club-form-rules'
import { PHONE_COUNTRY_CODES } from '../lib/phone-country-codes'
import { createClub, loadClub, updateClub } from '../service/save-club'
import {
  type ClubFormState,
  type ClubWebsiteProtocol,
  createEmptyClubForm
} from './club-form-state'
import {
  cloneClubFormState,
  copyHeadquartersAddress,
  mapClubToFormState,
  mapFormStateToClub
} from './map-club-form-state'

type UseClubFormOptions = {
  clubId?: MaybeRefOrGetter<string | undefined>
}

/** Protocol options for the website prefix select. */
export const WEBSITE_PROTOCOL_ITEMS: { title: string; value: ClubWebsiteProtocol }[] = [
  { title: 'https://', value: 'https://' },
  { title: 'http://', value: 'http://' }
]

/**
 * Composable for club form state, validation, and store persistence.
 *
 * @param options - Optional club id for edit mode.
 * @returns Form fields, translated validation rules, and submit/reset handlers.
 */
export function useClubForm(options: UseClubFormOptions = {}) {
  const { t } = useTranslation()
  const router = useRouter()

  const formRef = ref<VForm | null>(null)
  const isFormValid = ref(false)
  const isSaving = ref(false)
  const isLoading = ref(false)
  const saveErrorMessage = ref('')
  const loadErrorMessage = ref('')
  const fields = ref(createEmptyClubForm())
  const initialFields = ref<ClubFormState | null>(null)
  const existingMeta = ref<{ source: string | null; createdAt: string } | null>(null)

  const clubId = computed(() => toValue(options.clubId))
  const isEditMode = computed(() => Boolean(clubId.value))

  const mapRule = (rule: Parameters<typeof mapClubFormRule>[0]) => mapClubFormRule(rule, t)

  const nameRules = [mapRule(requiredMaxLengthRule(CLUB_NAME_MAX_LENGTH))]
  const shortNameRules = [mapRule(optionalMaxLengthRule(CLUB_SHORT_NAME_MAX_LENGTH))]
  const websiteHostRules = [mapRule(optionalWebsiteHostRule)]
  const districtRules = [mapRule(requiredMaxLengthRule(CLUB_DISTRICT_MAX_LENGTH))]
  const clubNumberRules = [mapRule(optionalClubNumberRule)]
  const streetRules = [mapRule(optionalMaxLengthRule(CLUB_STREET_MAX_LENGTH))]
  const houseNumberRules = [mapRule(optionalHouseNumberRule)]
  const postalCodeRules = [mapRule(optionalGermanPostalCodeRule)]
  const addressCityRules = [mapRule(optionalCityRule)]
  const emailRules = [mapRule(optionalEmailRule)]
  const phoneRules = [mapRule(optionalPhoneNumberRule)]

  const isSubmitDisabled = computed(
    () => !isFormValid.value || isSaving.value || isLoading.value || Boolean(loadErrorMessage.value)
  )

  watch(
    () =>
      [
        fields.value.trainingVenueSameAsHeadquarters,
        fields.value.billingAddressSameAsHeadquarters,
        fields.value.headquarters
      ] as const,
    () => {
      if (fields.value.trainingVenueSameAsHeadquarters) {
        fields.value.trainingVenue = copyHeadquartersAddress(fields.value.headquarters)
      }

      if (fields.value.billingAddressSameAsHeadquarters) {
        fields.value.billingAddress = copyHeadquartersAddress(fields.value.headquarters)
      }
    },
    { deep: true }
  )

  function setFormRef(value: unknown) {
    formRef.value = value as VForm | null
  }

  async function loadExistingClub(): Promise<void> {
    const id = clubId.value

    if (!id) {
      return
    }

    isLoading.value = true
    loadErrorMessage.value = ''

    try {
      const club = await loadClub(id)
      const mapped = mapClubToFormState(club)
      fields.value = cloneClubFormState(mapped)
      initialFields.value = cloneClubFormState(mapped)
      existingMeta.value = {
        source: club.source,
        createdAt: club.createdAt
      }
    } catch (error) {
      loadErrorMessage.value = t(translationKeys.form.loadError)
      logError(error as Error, 'clubs', 'load-club')
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    void loadExistingClub()
  })

  async function submit(): Promise<void> {
    const validation = await formRef.value?.validate()

    if (validation && !validation.valid) {
      return
    }

    isSaving.value = true
    saveErrorMessage.value = ''

    try {
      const id = clubId.value ?? crypto.randomUUID()
      const createdAt = existingMeta.value?.createdAt ?? new Date().toISOString()
      const source = existingMeta.value?.source ?? 'manual'
      const club = mapFormStateToClub(fields.value, { id, source, createdAt })

      if (isEditMode.value) {
        await updateClub(club)
      } else {
        await createClub(club)
      }

      await router.push({ name: 'clubs' })
    } catch (error) {
      saveErrorMessage.value = t(translationKeys.form.saveError)
      logError(error as Error, 'clubs', 'save-club')
    } finally {
      isSaving.value = false
    }
  }

  async function reset(): Promise<void> {
    if (initialFields.value) {
      fields.value = cloneClubFormState(initialFields.value)
    } else {
      fields.value = createEmptyClubForm()
    }

    saveErrorMessage.value = ''
    formRef.value?.resetValidation()
  }

  return {
    fields,
    isFormValid,
    isSaving,
    isLoading,
    saveErrorMessage,
    loadErrorMessage,
    isSubmitDisabled,
    websiteProtocolItems: WEBSITE_PROTOCOL_ITEMS,
    phoneCountryCodeItems: PHONE_COUNTRY_CODES,
    nameRules,
    shortNameRules,
    websiteHostRules,
    districtRules,
    clubNumberRules,
    streetRules,
    houseNumberRules,
    postalCodeRules,
    addressCityRules,
    emailRules,
    phoneRules,
    fieldLimits: {
      name: CLUB_NAME_MAX_LENGTH,
      shortName: CLUB_SHORT_NAME_MAX_LENGTH,
      websiteHost: CLUB_WEBSITE_HOST_MAX_LENGTH,
      district: CLUB_DISTRICT_MAX_LENGTH,
      clubNumber: CLUB_NUMBER_MAX_LENGTH,
      street: CLUB_STREET_MAX_LENGTH,
      houseNumber: CLUB_HOUSE_NUMBER_MAX_LENGTH,
      postalCode: CLUB_POSTAL_CODE_LENGTH,
      city: CLUB_CITY_MAX_LENGTH,
      phone: CLUB_PHONE_MAX_LENGTH
    },
    setFormRef,
    submit,
    reset
  }
}

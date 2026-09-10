import { computed, type MaybeRefOrGetter, onMounted, ref, toValue, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { VForm } from 'vuetify/components'
import { logError, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { mapAssociationFormRule } from '../lib/association-form-error-manager'
import {
  ASSOCIATION_CITY_MAX_LENGTH,
  ASSOCIATION_DISTRICT_MAX_LENGTH,
  ASSOCIATION_HOUSE_NUMBER_MAX_LENGTH,
  ASSOCIATION_NAME_MAX_LENGTH,
  ASSOCIATION_NUMBER_MAX_LENGTH,
  ASSOCIATION_PHONE_MAX_LENGTH,
  ASSOCIATION_POSTAL_CODE_LENGTH,
  ASSOCIATION_SHORT_NAME_MAX_LENGTH,
  ASSOCIATION_STREET_MAX_LENGTH,
  ASSOCIATION_WEBSITE_HOST_MAX_LENGTH,
  optionalAssociationNumberRule,
  optionalCityRule,
  optionalEmailRule,
  optionalGermanPostalCodeRule,
  optionalHouseNumberRule,
  optionalMaxLengthRule,
  optionalPhoneNumberRule,
  optionalWebsiteHostRule,
  requiredMaxLengthRule
} from '../lib/association-form-rules'
import { PHONE_COUNTRY_CODES } from '../lib/phone-country-codes'
import { createAssociation, loadAssociation, updateAssociation } from '../service/save-association'
import {
  type AssociationFormState,
  type AssociationWebsiteProtocol,
  createEmptyAssociationForm
} from './association-form-state'
import {
  cloneAssociationFormState,
  copyHeadquartersAddress,
  mapAssociationToFormState,
  mapFormStateToAssociation
} from './map-association-form-state'

type UseAssociationFormOptions = {
  associationId?: MaybeRefOrGetter<string | undefined>
}

/** Protocol options for the website prefix select. */
export const WEBSITE_PROTOCOL_ITEMS: { title: string; value: AssociationWebsiteProtocol }[] = [
  { title: 'https://', value: 'https://' },
  { title: 'http://', value: 'http://' }
]

/**
 * Composable for association form state, validation, and store persistence.
 *
 * @param options - Optional association id for edit mode.
 * @returns Form fields, translated validation rules, and submit/reset handlers.
 */
export function useAssociationForm(options: UseAssociationFormOptions = {}) {
  const { t } = useTranslation()
  const router = useRouter()

  const formRef = ref<VForm | null>(null)
  const isFormValid = ref(false)
  const isSaving = ref(false)
  const isLoading = ref(false)
  const saveErrorMessage = ref('')
  const loadErrorMessage = ref('')
  const fields = ref(createEmptyAssociationForm())
  const initialFields = ref<AssociationFormState | null>(null)
  const existingMeta = ref<{ source: string | null; createdAt: string } | null>(null)

  const associationId = computed(() => toValue(options.associationId))
  const isEditMode = computed(() => Boolean(associationId.value))

  const mapRule = (rule: Parameters<typeof mapAssociationFormRule>[0]) =>
    mapAssociationFormRule(rule, t)

  const nameRules = [mapRule(requiredMaxLengthRule(ASSOCIATION_NAME_MAX_LENGTH))]
  const shortNameRules = [mapRule(optionalMaxLengthRule(ASSOCIATION_SHORT_NAME_MAX_LENGTH))]
  const websiteHostRules = [mapRule(optionalWebsiteHostRule)]
  const districtRules = [mapRule(requiredMaxLengthRule(ASSOCIATION_DISTRICT_MAX_LENGTH))]
  const associationNumberRules = [mapRule(optionalAssociationNumberRule)]
  const streetRules = [mapRule(optionalMaxLengthRule(ASSOCIATION_STREET_MAX_LENGTH))]
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

  async function loadExistingAssociation(): Promise<void> {
    const id = associationId.value

    if (!id) {
      return
    }

    isLoading.value = true
    loadErrorMessage.value = ''

    try {
      const association = await loadAssociation(id)
      const mapped = mapAssociationToFormState(association)
      fields.value = cloneAssociationFormState(mapped)
      initialFields.value = cloneAssociationFormState(mapped)
      existingMeta.value = {
        source: association.source,
        createdAt: association.createdAt
      }
    } catch (error) {
      loadErrorMessage.value = t(translationKeys.form.loadError)
      logError(error as Error, 'associations', 'load-association')
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    void loadExistingAssociation()
  })

  async function submit(): Promise<void> {
    const validation = await formRef.value?.validate()

    if (validation && !validation.valid) {
      return
    }

    isSaving.value = true
    saveErrorMessage.value = ''

    try {
      const id = associationId.value ?? crypto.randomUUID()
      const createdAt = existingMeta.value?.createdAt ?? new Date().toISOString()
      const source = existingMeta.value?.source ?? 'manual'
      const association = mapFormStateToAssociation(fields.value, { id, source, createdAt })

      if (isEditMode.value) {
        await updateAssociation(association)
      } else {
        await createAssociation(association)
      }

      await router.push({ name: 'associations' })
    } catch (error) {
      saveErrorMessage.value = t(translationKeys.form.saveError)
      logError(error as Error, 'associations', 'save-association')
    } finally {
      isSaving.value = false
    }
  }

  async function reset(): Promise<void> {
    if (initialFields.value) {
      fields.value = cloneAssociationFormState(initialFields.value)
    } else {
      fields.value = createEmptyAssociationForm()
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
    associationNumberRules,
    streetRules,
    houseNumberRules,
    postalCodeRules,
    addressCityRules,
    emailRules,
    phoneRules,
    fieldLimits: {
      name: ASSOCIATION_NAME_MAX_LENGTH,
      shortName: ASSOCIATION_SHORT_NAME_MAX_LENGTH,
      websiteHost: ASSOCIATION_WEBSITE_HOST_MAX_LENGTH,
      district: ASSOCIATION_DISTRICT_MAX_LENGTH,
      associationNumber: ASSOCIATION_NUMBER_MAX_LENGTH,
      street: ASSOCIATION_STREET_MAX_LENGTH,
      houseNumber: ASSOCIATION_HOUSE_NUMBER_MAX_LENGTH,
      postalCode: ASSOCIATION_POSTAL_CODE_LENGTH,
      city: ASSOCIATION_CITY_MAX_LENGTH,
      phone: ASSOCIATION_PHONE_MAX_LENGTH
    },
    setFormRef,
    submit,
    reset
  }
}
